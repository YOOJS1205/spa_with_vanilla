class ProductLikeButton {
  constructor() {}

  addClickEvent(likeButton) {
    likeButton.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log("좋아요 버튼 클릭");
    });
  }

  render() {
    const likeButton = document.createElement("button");
    likeButton.setAttribute("class", "like-btn");

    const likeButtonIr = document.createElement("span");
    likeButtonIr.setAttribute("class", "ir");
    likeButtonIr.innerText = "좋아요 버튼";

    likeButton.appendChild(likeButtonIr);
    this.addClickEvent(likeButton);

    return likeButton;
  }
}

export default ProductLikeButton;
