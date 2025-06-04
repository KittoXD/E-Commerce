import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CarrinhoView from '../views/CarrinhoView.vue'
import ProdutoDetalheView from '../views/ProdutoDetalheView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/carrinho',
    name: 'cart',
    component: CarrinhoView,
  },
  {
    path: '/produto/:id',
    name: 'ProdutoDetalhe',
    component: ProdutoDetalheView,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router