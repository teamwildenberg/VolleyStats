import { html, css, LitElement, property } from 'lit-element';
import { iScoringService } from '../services/scoring/i-scoring-service';
import { Fragment } from '../services/scoring/play/fragment';

export class HomeComponent extends LitElement{
    public video: any = 'M7lc1UVf-VE';
    public player?: YT.Player;

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

    @property({type: Object})fragment?: Fragment;

    render (){
        return html`
<main id="main">
    <section>
        <h1>Getting Started</h1>
        <p>
            ${this.fragment?.title}
        </p>
        <div id="player"></div>
    </section>
</main>
`;
    }

    override  firstUpdated(){
          // 2. This code loads the IFrame Player API code asynchronously.
          var tag = document.createElement('script');

//          tag.src = "https://www.youtube.com/iframe_api";
          var firstScriptTag = document.getElementsByTagName('script')[0];
          if (firstScriptTag != null && firstScriptTag.parentNode != null){
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

             // 3. This function creates an <iframe> (and YouTube player)
            //    after the API code downloads.
            var playerDiv = <HTMLElement>this.shadowRoot?.getElementById("player");
            if (playerDiv != null){
                (window as any).onYouTubeIframeAPIReady =  () => {
                    this.player = new YT.Player(playerDiv, {
                    height: '390',
                    width: '640',
                    videoId: this.video,
                    playerVars: {
                        'playsinline': 1
                    },
                    events: {
                        'onReady': this.onPlayerReady,
                        'onStateChange': this.onPlayerStateChange
                    }
                    });
                }
            }
          }

    }

    override connectedCallback(){
        super.connectedCallback();

        var scoringService: iScoringService = globalThis.di.get(iScoringService);
        scoringService.registerKeyDown();
        scoringService.scoringData.subscribe(s =>{
            if (s.type == 'fragment'){
                this.fragment = <Fragment>s;
            }
        })
    }

    override disconnectedCallback(){
        super.disconnectedCallback();
        var scoringService: iScoringService = globalThis.di.get(iScoringService);
        scoringService.unregisterKeyDown();
    }

    // 4. The API will call this function when the video player is ready.
    onPlayerReady(event: any) {
    event.target.playVideo();
    }

    // 5. The API calls this function when the player's state changes.
    //    The function indicates that when playing a video (state=1),
    //    the player should play for six seconds and then stop.

    onPlayerStateChange(event: any) {
    
    }
    stopVideo() {
    this.player?.stopVideo();
    }
}

customElements.define('home-component', HomeComponent);