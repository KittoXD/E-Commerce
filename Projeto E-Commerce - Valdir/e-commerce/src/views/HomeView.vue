<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold text-green-600 mb-8 text-center">
      🛍️ Bem-vindo ⭐
    </h1>
    <!-- Barra de busca -->
    <div class="mb-10 max-w-xl mx-auto relative">
      <!-- Ícone de busca -->
      <div
        class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
      >
        <svg
          class="w-5 h-5 text-gray-200"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
          />
        </svg>
      </div>

      <!-- Campo de pesquisa -->
      <input
        v-model="searchTerm"
        type="text"
        placeholder="Pesquisar produtos..."
        class="w-full pl-12 pr-4 py-3 rounded-2xl bg-gray-800 shadow-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 placeholder-gray-300 text-gray-200"
      />
    </div>

    <!-- Categorias -->
    <div class="flex flex-wrap justify-center gap-4 mb-10">
      <button
        v-for="category in fixedCategories"
        :key="category.value"
        @click="trocarCategoria(category.value)"
        :class="[
          'px-4 py-2 rounded-full border transition-colors',
          selectedCategory === category.value
            ? 'bg-green-400 text-white border-green-400'
            : 'bg-white text-black border-green-200 hover:bg-green-500',
        ]"
      >
        {{ category.label }}
      </button>
    </div>

    <div v-if="loading" class="text-gray-500 text-center py-10">
      Carregando produtos...
    </div>

    <div v-else>
      <!-- Grade de produtos -->
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6"
      >
        <div
          v-for="product in paginatedProducts"
          :key="product.id"
          @click="goToProduct(product.id)"
          class="bg-white border rounded-lg shadow hover:shadow-lg transition-transform transform hover:scale-[1.03] cursor-pointer flex flex-col"
        >
          <img
            :src="product.thumbnail"
            :alt="product.title"
            class="w-full h-48 object-cover rounded-t"
          />
          <div class="p-4 flex flex-col flex-grow">
            <h3
              class="text-lg font-semibold text-gray-800 truncate mb-2"
              :title="product.title"
            >
              {{ product.title }}
            </h3>
            <div class="flex justify-between items-center mb-2">
              <p class="text-green-600 font-bold mb-2">
                $ {{ product.price.toFixed(2) }}
              </p>
              <p class="text-sm text-green-700">Estoque: {{ product.stock }}</p>
            </div>
            <button
              @click.stop="addToCartAndGoCart(product)"
              class="mt-auto bg-gray-900 hover:bg-green-800 text-white py-2 px-4 rounded-md shadow"
            >
              Adicionar ao carrinho
            </button>
          </div>
        </div>
      </div>

      <!-- Navegação da página -->
      <div class="flex justify-center items-center gap-6 mt-6">
        <button
          @click="voltarPagina"
          :disabled="currentPage === 1"
          class="px-5 py-2.5 bg-green-600 text-white rounded-xl font-semibold shadow-md transition-all duration-200 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Anterior
        </button>

        <span class="text-lg font-medium text-green-800">
          Página {{ currentPage }} de {{ totalPages }}
        </span>

        <button
          @click="proximaPagina"
          :disabled="currentPage === totalPages"
          class="px-5 py-2.5 bg-green-600 text-white rounded-xl font-semibold shadow-md transition-all duration-200 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Próximo →
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import axios from "axios";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const searchTerm = ref("");
const selectedCategory = ref(route.query.category || "Todos");
const currentPage = ref(parseInt(route.query.page) || 1);

const products = ref([]);
const fixedCategories = ref([{ label: "Todos", value: "Todos" }]);
const loading = ref(true);
const productsPerPage = 8;

async function pegarCategorias() {
  try {
    const res = await axios.get("https://dummyjson.com/products/categories");
    console.log("res.data categories:", res.data);
    const apiCategories = res.data.map((cat) => ({
      label: cat.name,
      value: cat.slug,
    }));
    fixedCategories.value = [
      { label: "Todos", value: "Todos" },
      ...apiCategories,
    ];
    console.log("Categorias carregadas:", fixedCategories.value);
  } catch (error) {
    console.error("Erro ao carregar categorias:", error);
    alert("Erro ao carregar categorias.");
  }
}

async function carregarProdutos() {
  loading.value = true;
  try {
    let url =
      selectedCategory.value === "Todos"
        ? "https://dummyjson.com/products?limit=200"
        : `https://dummyjson.com/products/category/${selectedCategory.value}`;

    const res = await axios.get(url);
    products.value = res.data.products;
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    products.value = [];
  } finally {
    loading.value = false;
  }
}

const filteredProducts = computed(() => {
  let filtered = products.value;

  if (searchTerm.value.trim() !== "") {
    const term = searchTerm.value.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
    );
  }

  return filtered;
});

const totalPages = computed(() =>
  Math.ceil(filteredProducts.value.length / productsPerPage)
);

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * productsPerPage;
  return filteredProducts.value.slice(start, start + productsPerPage);
});

function trocarCategoria(novaCategoria) {
  // Atualiza somente pela rota, o restante será tratado nos watchers
  router
    .push({
      path: "/",
      query: {
        category: novaCategoria,
        page: 1,
      },
    })
    .catch((err) => {
      if (err.name !== "NavigationDuplicated") {
        console.error("Erro ao atualizar rota:", err);
      }
    });
}

function voltarPagina() {
  if (currentPage.value > 1) {
    currentPage.value--;
    atualizarRota();
  }
}

function proximaPagina() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    atualizarRota();
  }
}

function atualizarRota() {
  router
    .push({
      path: "/",
      query: {
        category: selectedCategory.value,
        page: currentPage.value,
      },
    })
    .catch((err) => {
      if (err.name !== "NavigationDuplicated") {
        console.error("Erro ao atualizar rota:", err);
      }
    });
}

function addToCartAndGoCart(product) {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  if (!cart.find((item) => item.id === product.id)) {
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`Adicionado ao carrinho: ${product.title}`);
    router.push("/carrinho"); // Navega para o carrinho
  } else {
    alert("Produto já está no carrinho.");
  }
}

function goToProduct(id) {
  router
    .push({
      path: `/produto/${id}`,
      // Não precisa passar category e page para a rota de produto,
      // a menos que o componente de detalhe precise deles.
      // Isso evita URLs muito longas e complexas se não for necessário.
    })
    .catch((err) => {
      if (err.name !== "NavigationDuplicated") {
        console.error("Erro ao ir para produto:", err);
      }
    });
}

async function fetchProducts() {
  loading.value = true;
  try {
    const res = await axios.get(`https://dummyjson.com/products?limit=200`);
    products.value = res.data.products;
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    products.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  await pegarCategorias();
});

// Observa mudanças na rota e reage a elas
watch(
  () => route.query,
  (newQuery) => {
    selectedCategory.value = newQuery.category || "Todos";
    currentPage.value = parseInt(newQuery.page) || 1;
    carregarProdutos(); // <- chama aqui pra atualizar os produtos!
  },
  { immediate: true }
);
</script>
