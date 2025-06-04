<template>
  <div class="max-w-3xl mx-auto p-6 mt-20">
    <div v-if="produto" class="bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row gap-8">
      <img
        :src="produto.thumbnail"
        :alt="produto.title"
        class="w-full md:w-1/2 rounded-lg object-cover"
      />

      <div class="flex flex-col justify-between flex-1">
        <h1 class="text-3xl font-extrabold text-green-700 mb-4">{{ produto.title }}</h1>
        <p class="text-gray-700 mb-6 leading-relaxed">{{ produto.description }}</p>
        <p class="text-2xl font-bold text-green-600 mb-6">$ {{ produto.price.toFixed(2) }}</p>

        <button
          @click="addToCart(produto)"
          class="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition"
        >
          Adicionar ao carrinho
        </button>
      </div>
    </div>

    <div v-else class="text-center text-gray-500 mt-40 text-lg">
      Carregando produto...
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'

const route = useRoute()
const produto = ref(null)

async function fetchProduto() {
  const id = route.params.id
  try {
    const res = await axios.get(`https://dummyjson.com/products/${id}`)
    produto.value = res.data
  } catch (e) {
    produto.value = null
    alert('Erro ao carregar produto.')
  }
}


function addToCart(product) {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]')
  const existing = cart.find(item => item.id === product.id)
  if (existing) {
    existing.quantity = (existing.quantity || 1) + 1
  } else {
    cart.push({ ...product, quantity: 1 })
  }
  localStorage.setItem('cart', JSON.stringify(cart))
  alert(`Produto "${product.title}" adicionado ao carrinho!`)
}

onMounted(fetchProduto)
</script>
