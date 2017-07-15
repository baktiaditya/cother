import NotFoundPage from '../pages/NotFoundPage/NotFoundPage';
import HomePage from '../pages/HomePage/HomePage';
import TextEditorPage from '../pages/TextEditorPage/TextEditorPage';

/**
 * Please read react-router plain routes
 * @link https://goo.gl/hMZWTp
 */
export default [
  {
    path: '/not-found',
    component: NotFoundPage
  },
  {
    path: '/',
    component: HomePage
  },
  {
    path: '/:id',
    component: TextEditorPage
  },
  {
    path: '*',
    onEnter: ({ params }, replace) => replace('/not-found')
  }
];
