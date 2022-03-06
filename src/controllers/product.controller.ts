import { Products } from "@prisma/client";
import prisma from "../database/db";
import { Product, ProductOptions } from "../Items/Product.interface";

export const getProducts = async ( options?: ProductOptions ): Promise<null | Product[]> => {
  try {
    const products: any = await prisma.products.findMany({
      where: {
        id: {
          equals: "6222055af23dc2135189343d"
        }
      },
    });
    console.log(products)
    return products;
  } catch (error) {
    return null;
  }
};

export const filterbyCategory = async (category: any) => {
  const idProduct : any[] = await prisma.categories.findMany({
    where: {
      name: category
    }, 
    select:{
      productId: true
    }
  })
  
  const filterCategory : any[] = await prisma.products.findMany({
    where: {
      id: { in: idProduct}
    }
  })
  return filterCategory
};

export const filterByName = async ( name: any) => {
  const filterName : any[] = await prisma.products.findMany({
      where:{
        name
      }
  })
  return filterName;
};

export const filterById = async (id: any) => {
  const filterID : any[] = await prisma.products.findMany({
    where: {
      id
    }
  })
  return filterID;
};



export const saveNewProduct = async (data: any) => {
  // TODO: especificar los datos que se deben de recibir de forma obligatoria
  try {
    const newProduct : any = await prisma.products.create({
      data: data,
    });

    for (let i = 0; i < data.categoriesId.length; i++) {
      
      let idPro = await prisma.categories.findUnique({
        where: {
          id: data.categoriesId[i] 
        },
        select: {
          productId: true
        }
      })
      idPro?.productId.push(newProduct.id)
      
      
      const category = await prisma.categories.update({
        where: {
          id: data.categoriesId[i]
        },
        data: {
          productId: idPro?.productId
        }
      })

      //console.log(idPro);
      
    }
    if (newProduct) return newProduct;

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const infoProduct = async (idProduct: string): Promise<Products | null> => {
  try {
    let product: Products | null = await prisma.products.findUnique({where: {id: idProduct}})
    return product
  } catch (error) {
    return null
  }
}