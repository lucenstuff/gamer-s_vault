class HeaderComponent extends HTMLElement{
  constructor(){
    super()
  }
  connectedCallback(){
    fetch('src/components/header/header-content.html')
    .then(response => response.text())
    .then(content => {
      this.innerHTML = content;
    })
    .catch(error => {
      console.error('Error al cargar el archivo HTML:', error);
    });
  }
}

window.customElements.define('header-component',HeaderComponent)

