class ProductItem {
  constructor(item) {
    this.item = item;
  }
  render() {
    const productItem = document.createElement("li");

    productCard.appendChild(productImageContainer);
    productCard.appendChild(productName);
    productCard.appendChild(productPriceContainer);

    productItem.appendChild(productCard);

    return productItem;
  }
}

export default ProductItem;
