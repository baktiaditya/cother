import ErrorPage from './pages/ErrorPage/ErrorPage';
import HomePage from './pages/HomePage/HomePage';
import TextEditorPage from './pages/TextEditorPage/TextEditorPage';

/**
 * Please read react-router plain routes
 * @link https://goo.gl/hMZWTp
 */
export default [
  {
    path: '/not-found',
    component: ErrorPage
  },
  {
    path: '/',
    component: HomePage
  },
  {
    path: '/:action',
    component: TextEditorPage
  },
  {
    path: '*',
    onEnter: ({ params }, replace) => replace('/not-found')
  }
];
