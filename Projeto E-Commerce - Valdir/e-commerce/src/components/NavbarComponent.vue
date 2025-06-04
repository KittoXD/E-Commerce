<template>
  <nav
    class="bg-gradient-to-b from-black to-green-600/90 text-white w-64 flex flex-col p-6 shadow-lg h-full
           md:w-72 lg:w-64 fixed md:static top-0 left-0 z-30 transform md:transform-none
           transition-transform duration-300 ease-in-out"
    :class="{'-translate-x-full': !menuOpen, 'translate-x-0': menuOpen}"
  >
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-extrabold">E-Commerce</h1>

      <button @click="toggleMenu" class="md:hidden focus:outline-none" aria-label="Fechar menu">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none"
             viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <ul class="flex flex-col space-y-4">
      <li>
        <router-link
          to="/"
          class="flex items-center p-3 rounded hover:bg-green-500 transition-colors duration-200"
          active-class="bg-green-400 font-semibold"
          exact
          @click="closeMenu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6 mr-2">
            <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
          Home
        </router-link>
      </li>
      <li>
        <router-link
          to="/carrinho"
          class="flex items-center p-3 rounded hover:bg-green-500 transition-colors duration-200 relative"
          active-class="bg-green-400 font-semibold"
          @click="closeMenu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6 mr-2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
          </svg>
          Carrinho
          <span
            v-if="cartCount > 0"
            class="absolute top-2 right-3 bg-white text-green-600 font-bold text-xs rounded-full px-2 py-0.5"
          >
            {{ cartCount }}
          </span>
        </router-link>
      </li>
    </ul>

    <div class="mt-auto pt-6 border-t border-black text-center">
      <p class="mt-4 text-xs text-black select-none">© E-Commerce</p>
    </div>
  </nav>

  <!-- Botão hamburguer para abrir o menu quando fechado -->
  <button
    @click="toggleMenu"
    class="fixed top-4 left-4 z-40 md:hidden bg-sky-700 text-white p-2 rounded shadow-lg"
    v-if="!menuOpen"
    aria-label="Abrir menu"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none"
         viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round"
            d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  </button>
</template>

<script>
export default {
  name: 'NavbarComponent',
  mounted() {
    this.updateCartCount();
    window.addEventListener('storage', this.updateCartCount);
  },
  methods: {
    updateCartCount() {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      this.cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    },
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
    closeMenu() {
      this.menuOpen = false;
    },
    goToCart() {
      this.closeMenu();
      this.$router.push('/carrinho');
    },
  },
  data() {
    return {
      menuOpen: false,
      cartCount: 0,
    };
  },
};
</script>