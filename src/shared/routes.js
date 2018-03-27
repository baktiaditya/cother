import BasePage from '../pages/BasePage/BasePage';

/**
 * Please read react-router plain routes
 * @link https://goo.gl/hMZWTp
 */
export default [
  {
    path: '/not-found',
    getComponent: (nextState, cb) => {
      require.ensure([], (require) => {
        cb(null, require('../pages/NotFoundPage/NotFoundPage').default);
      });
    },
  },
  {
    path: '/',
    component: BasePage,
    indexRoute: {
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('../pages/HomePage/HomePage').default);
        });
      },
    },
    childRoutes: [
      {
        path: 'anonymous/:id',
        getComponent: (nextState, cb) => {
          require.ensure([], (require) => {
            cb(null, require('../pages/TextEditorPage/TextEditorPage').default);
          });
        },
      },
    ],
  },
  {
    path: '*',
    onEnter: ({ params }, replace) => replace('/not-found'),
  },
];
