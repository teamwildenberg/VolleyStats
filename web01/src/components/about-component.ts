import { html, css, LitElement } from 'lit-element';

export class AboutComponent extends LitElement{
    static get styles(){
        return css`
body main {
    margin: auto;
    background-color: #f9f9f9;
    width: 100vw;
    height: 100vh;
}

body section {
    padding-top: 30vh;
    text-align: center;
}
`;
    }

    render (){
        return html`
<main>
    <section>
        <h1>About</h1>
    </section>
</main>
`;
    }
}

customElements.define('about-component', AboutComponent);