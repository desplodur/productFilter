import "./styles.css";
import { useState, useEffect } from "react";
import styled from "styled-components";

export default function App() {
  const [data, setData] = useState(null);
  const [filters, setFilters] = useState([]);
  const [uniqueCategories, setUniqueCategories] = useState([]);
  const [uniqueBrands, setUniqueBrands] = useState([]);

  useEffect(() => {
    fetch("https://dummyjson.com/products")
      .then((res) => res.json())
      .then((data) => {
        const dataToSet = data;
        setData(dataToSet.products);
        getUniqueCategories(dataToSet.products);
        getUniqueBrands(dataToSet.products);
      });
  }, []);
  if (!data) {
    return <>..Loading</>;
  }

  function getUniqueCategories(data) {
    let categories;
    categories = data.map((product) => {
      return product.category;
    });
    setUniqueCategories([...new Set(categories)]);
  }

  function getUniqueBrands(data) {
    let brands = data.map((product) => {
      let newBrand = { brandName: product.brand, selected: false };
      return newBrand;
    });
    setUniqueBrands([...new Set(brands)]);
  }

  function setFilterFunction(cat) {
    console.log(cat);
    if (!filters.includes(cat)) {
      toggleSelected(cat);
      setFilters([...filters, cat]);
    } else {
      console.log("filter is already set");
    }
  }

  function toggleSelected(cat) {
    uniqueBrands.map((brand) => {
      if (brand.brandName === cat) {
        return (brand.selected = !brand.selected);
      } else return brand;
    });
  }

  function removeFilterFunction(cat) {
    let newFilters = [...filters];
    if (newFilters.includes(cat)) {
      const index = newFilters.indexOf(cat);
      if (index > -1) {
        newFilters.splice(index, 1);
        setFilters(newFilters);
      }
    } else {
      console.log("filter doesnt exist");
    }
  }

  let filteredProducts = data.filter((product) => {
    if (filters.includes(product.category)) {
      return { product };
    }
    if (filters.includes(product.brand)) {
      return { product };
    }
    return null;
  });

  console.log("rendered");
  return (
    <div className="App">
      <StyledDropdown>
        <button className="dropbtn">Brands</button>
        <div className="dropdown-content">
          {uniqueBrands?.map((brand) => {
            return (
              <button
                key={brand.index}
                className={brand.selected && "selected"}
                activeClassName="any"
                onClick={() => {
                  setFilterFunction(brand.brandName);
                }}
              >
                {brand.brandName}
              </button>
            );
          })}
        </div>
      </StyledDropdown>
      <StyledDropdown>
        <button className="dropbtn">Categories</button>
        <div className="dropdown-content">
          {uniqueCategories?.map((cat) => {
            return (
              <button
                key={cat.index}
                activeClassName="any"
                onClick={() => {
                  setFilterFunction(cat);
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </StyledDropdown>
      <StyledFilterFlex>
        {filters?.map((filter) => {
          return (
            <StyledCategory>
              {filter}
              <StyledDeleteButton
                onClick={() => {
                  removeFilterFunction(filter);
                }}
              >
                x
              </StyledDeleteButton>
            </StyledCategory>
          );
        })}
      </StyledFilterFlex>
      <StyledProductGrid className="productList">
        {filteredProducts.length > 0
          ? filteredProducts.map((product) => {
              return (
                <StyledProductSection key={product.id}>
                  {product.title} {product.brand}
                </StyledProductSection>
              );
            })
          : data.map((product) => {
              return (
                <StyledProductSection key={product.id}>
                  {product.title} {product.brand}
                </StyledProductSection>
              );
            })}
      </StyledProductGrid>
    </div>
  );
}

const StyledDropdown = styled.div`
  position: relative;
  display: inline-block;
  .dropbtn {
    background-color: darkcyan;
    color: white;
    padding: 16px;
    font-size: 16px;
    border: none;
  }

  selected {
    background-color: red;
  }

  .dropdown-content {
    display: none;
    position: absolute;
    background-color: #f1f1f1;
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    z-index: 1;
  }

  .dropdown-content button {
    width: 100%;
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
    border: none;
  }

  .dropdown-content button:hover {
    background-color: #ddd;
  }

  :hover .dropdown-content {
    display: block;
  }

  :hover .dropbtn {
    background-color: #00b8b8;
  }
`;

const StyledFilterFlex = styled.article`
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  width: 100%;
  min-height: 5vh;
  margin: 2em 0 2em 0;
  color: white;
`;

const StyledProductGrid = styled.article`
  display: grid;
  width: 100%;
  min-height: 5vh;
  grid-template-columns: repeat(3, auto);
  grid-gap: 2em;
  margin: 2em 0 2em 0;
  color: white;
`;

const StyledProductSection = styled.section`
  max-width: 30vw;
  height: 30vw;
  border-radius: 10%;
  background-color: darkcyan;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledCategory = styled.div`
  position: relative;
  color: black;
  width: fit-content;
  height: 2em;
  background-color: lightgrey;
  border-radius: 0.5em;
  padding-left: 10px;
  padding-right: 10px;
  margin: 0.5em;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledDeleteButton = styled.button`
  position: absolute;
  top: -0.5em;
  right: -0.5em;
  width: 1.2em;
  height: 1.2em;
  border-radius: 100%;
  background-color: gray;
  color: white;
  border: none;
  padding: 0;
`;
