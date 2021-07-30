import './styles.css';
import '!!style-loader!css-loader?modules!./styles.css';
import { Router } from '@vaadin/router';
import start from './app'
import './components/app-component';


const routes=[
  {
    path: '/',
    component: 'app-component',
    children:[
      {
        path: '',
        component: 'home-component',
        action: async () => {
          await import('./components/home-component')
        }
      },
      // {
      //   path: 'graph',
      //   component: 'graph-component',
      //   action: async () => {
      //     await import('./components/graph/graph-component')
      //   },
      //   children:[
      //     {
      //       path: 'detail/:id',
      //       component: 'graph-detail-component',
      //       action: async() => {
      //         await import('./components/graph/graph-detail-component');
      //       } 
      //     }
      //   ]
      // },
      {
        path: 'about',
        component: 'about-component',
        action: async () => {
          await import('./components/about-component')
        }
      },
    ],
  },
  {path: '(.*)', component: 'app-component'}
];

const outlet = document.getElementById('outlet');
export const router = new Router(outlet);
router.setRoutes(routes);

(function () {
  start();
}());