import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import { Container, ContentWithPaddingXl } from "components/misc/Layouts.js";
import { SectionHeading } from "components/misc/Headings.js";
import { PrimaryButton as PrimaryButtonBase } from "components/misc/Buttons.js";
import { ReactComponent as SvgDecoratorBlob1 } from "images/svg-decorator-blob-5.svg";
import { ReactComponent as SvgDecoratorBlob2 } from "images/svg-decorator-blob-7.svg";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { obtenerProductos } from "scripts/obtenerProductosCategoria";
import { buscarProducto } from "scripts/buscarProducto";

const HeaderRow = tw.div`flex justify-between items-center flex-col xl:flex-row`;
const Header = tw(SectionHeading)``;
const TabsControl = tw.div`flex flex-wrap bg-gray-200 px-2 py-2 rounded leading-none mt-12 xl:mt-0`;
const SearchInput = tw.input`w-1/3 px-4 py-2 mt-4 mb-4 border border-black rounded-md`;

const TabControl = styled.div`
  ${tw`cursor-pointer px-6 py-3 mt-2 sm:mt-0 sm:mr-2 last:mr-0 text-gray-600 font-medium rounded-sm transition duration-300 text-sm sm:text-base w-1/2 sm:w-auto text-center`}
  &:hover {
    ${tw`bg-gray-300 text-gray-700`}
  }
  ${props => props.active && tw`bg-primary-500! text-gray-100!`}
  }
`;

const TabContent = tw(motion.div)`mt-6 flex flex-wrap sm:-mr-10 md:-mr-6 lg:-mr-12`;
const CardContainer = tw.div`mt-10 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 sm:pr-10 md:pr-6 lg:pr-12`;
const Card = tw(motion.a)`bg-gray-200 rounded-b block max-w-xs mx-auto sm:max-w-none sm:mx-0`;
const CardImageContainer = styled.div`
  ${props => css`background-image: url("${props.imageSrc}");`}
  ${tw`h-56 xl:h-64 bg-center bg-cover relative rounded-t`}
`;

const CardHoverOverlay = styled(motion.div)`
  background-color: rgba(255, 255, 255, 0.5);
  ${tw`absolute inset-0 flex justify-center items-center`}
`;
const CardButton = tw(PrimaryButtonBase)`text-sm`;
const CardText = tw.div`p-4 text-gray-900`;
const CardTitle = tw.h5`text-lg font-semibold group-hover:text-primary-500`;
const CardContent = tw.p`mt-1 text-sm font-medium text-gray-600`;
const CardPrice = tw.p`mt-4 text-xl font-bold`;

const DecoratorBlob1 = styled(SvgDecoratorBlob1)`
  ${tw`pointer-events-none -z-20 absolute right-0 top-0 h-64 w-64 opacity-15 transform translate-x-2/3 -translate-y-12 text-pink-400`}
`;
const DecoratorBlob2 = styled(SvgDecoratorBlob2)`
  ${tw`pointer-events-none -z-20 absolute left-0 bottom-0 h-80 w-80 opacity-15 transform -translate-x-2/3 text-primary-500`}
`;

export default () => {
  /*
   * To customize the tabs, pass in data using the `tabs` prop. It should be an object which contains the name of the tab
   * as the key and value of the key will be its content (as an array of objects).
   * To see what attributes are configurable of each object inside this array see the example above for "Starters".
   */
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();
  const productosRedux = useSelector((state) => state.productos);
  const categoriasRedux = useSelector((state) => state.categorias);
  const [activeTab, setActiveTab] = useState("Todos");
  const { categoria } = useParams();
  const [cartItems, setCartItems] = useState([]);

  // Cargar productos desde Redux
  useEffect(() => {
    const fetchProductos = async () => {
      await obtenerProductos(dispatch);
    };
    fetchProductos();
  }, [dispatch]);

  useEffect(() => {
    if (productosRedux && productosRedux.length > 0) {
      const transformedProducts = productosRedux.map((producto) => ({
        imageSrc: producto.imageUrl || "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80",
        title: producto.descripcion || "Sin nombre",
        price: producto.precio || "$0.00",
        category: producto.categoria || "Otros",
        url: '#'
      }));
      setProducts(transformedProducts);
      setFilteredProducts(transformedProducts); // Inicialmente, todos los productos están filtrados
    }
  }, [productosRedux]);

  // Crear tabs dinámicamente con categorías, agregando "Todos"
  const tabs = {
    Todos: filteredProducts,
    ...categoriasRedux.reduce((acc, categoria) => {
      acc[categoria.titulo] = filteredProducts.filter((product) => product.category === categoria.titulo);
      return acc;
    }, {})
  };

  useEffect(() => {
    if (categoria) {
      setActiveTab(categoria === "todos" ? "Todos" : categoria.charAt(0).toUpperCase() + categoria.slice(1));
    }
  }, [categoria]);

  // Función para manejar la búsqueda
  const handleSearch = async () => {
    if (searchText.trim() === "") {
        setFilteredProducts(products); // Restablece todos los productos si el campo de búsqueda está vacío
    } else {
        try {
            const resultados = await buscarProducto(searchText); // Usa el script de búsqueda

            // Aplica la misma transformación a los resultados de búsqueda
            const transformedResults = resultados.map((producto) => ({
                imageSrc: producto.imageUrl || "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80",
                title: producto.descripcion || "Sin nombre",
                price: producto.precio || "$0.00",
                category: producto.categoria || "Otros",
                url: '#'
            }));

            setFilteredProducts(transformedResults); // Muestra solo los resultados transformados de la búsqueda
        } catch (error) {
            console.error("Error en la búsqueda:", error);
        }
    }
};

/*
const addToCart = (producto) => {
  console.log("Producto recibido:", producto);
  console.log("Descripción válida:", typeof producto.descripcion === "string" && producto.descripcion.trim() !== "");
  console.log("Precio válido:", typeof producto.precio === "number" && producto.precio > 0);
  console.log("Producto como JSON:", JSON.stringify(producto, null, 2));
  if (!producto.descripcion || !producto.precio) {
    console.error("El producto no tiene las propiedades necesarias:", producto);
    return;
  }

  setCartItems((prevItems) => {
    console.log("Estado previo del carrito:", prevItems);
    const existingItem = prevItems.find((item) => item.descripcion === producto.descripcion);
    if (existingItem) {
      return prevItems.map((item) =>
        item.descripcion === producto.descripcion
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    }
    console.log("Estado actual del carrito:", cartItems);
    return [...prevItems, { ...producto, quantity: 1 }];
  });
};


const handleRemoveItem = (itemToRemove) => {
  setCartItems((prevItems) => prevItems.filter(item => item.id !== itemToRemove.id));
};

const handleCheckout = () => {
  alert('Compra realizada con éxito');
  setCartItems([]); // Limpia el carrito después del checkout
};
*/

const addToCart = (product) => {
  setCartItems((prevItems) => {
    const existingItem = prevItems.find((item) => item.title === product.title);
    if (existingItem) {
      return prevItems.map((item) =>
        item.title === product.title
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    }
    return [...prevItems, { ...product, quantity: 1 }];
  });
};

  return (
    <Container>
      <ContentWithPaddingXl>
        <HeaderRow>
          <Header>Nuestros Productos</Header>
          <SearchInput
            type="text"
            placeholder="Buscar productos..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()} // Permite buscar presionando Enter
          />
        </HeaderRow>
        <HeaderRow>
          <TabsControl>
            {Object.keys(tabs).map((tabName, index) => (
              <TabControl key={index} active={activeTab === tabName} onClick={() => setActiveTab(tabName)}>
                {tabName}
              </TabControl>
            ))}
          </TabsControl>
        </HeaderRow>

        {Object.keys(tabs).map((tabKey, index) => (
          <TabContent
            key={index}
            variants={{
              current: {
                opacity: 1,
                scale:1,
                display: "flex",
              },
              hidden: {
                opacity: 0,
                scale:0.8,
                display: "none",
              }
            }}
            transition={{ duration: 0.4 }}
            initial={activeTab === tabKey ? "current" : "hidden"}
            animate={activeTab === tabKey ? "current" : "hidden"}
          >
            {tabs[tabKey].map((card, index) => (
              <CardContainer key={index}>
                <Card className="group" href={card.url} initial="rest" whileHover="hover" animate="rest">
                  <CardImageContainer imageSrc={card.imageSrc}>
                    <CardHoverOverlay
                      variants={{
                        hover: {
                          opacity: 1,
                          height: "auto"
                        },
                        rest: {
                          opacity: 0,
                          height: 0
                        }
                      }}
                      transition={{ duration: 0.3 }}
                    >
                     <CardButton onClick={() => addToCart(card.title)}>Comprar</CardButton>  
                    </CardHoverOverlay>
                  </CardImageContainer>
                  <CardText>
                    <CardTitle>{card.title}</CardTitle>
                    <CardContent>{card.content}</CardContent>
                    <CardPrice>${card.price}</CardPrice>
                  </CardText>
                </Card>
              </CardContainer>
            ))}
          </TabContent>
        ))}
      </ContentWithPaddingXl>
      <DecoratorBlob1 />
      <DecoratorBlob2 />
    </Container>
  );
};
