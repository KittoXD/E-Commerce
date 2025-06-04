<template>
  <div class="max-w-4xl mx-auto p-6 mt-20">
    <h2 class="text-4xl font-extrabold text-green-600 mb-8 text-center">⭐ Carrinho 🛒</h2>

    <div v-if="cart.length === 0" class="text-center text-gray-600 py-20 text-lg">
      Seu carrinho está vazio.
    </div>

    <div v-else class="space-y-6">
      <div
        v-for="item in cart"
        :key="item.id"
        class="flex items-center justify-between bg-white p-4 rounded-lg shadow-md"
      >
        <img
          :src="item.thumbnail"
          :alt="item.title"
          class="w-20 h-20 object-cover rounded-md"
        />
        <div class="flex-1 px-4">
          <h3 class="font-semibold text-lg text-gray-800 truncate">{{ item.title }}</h3>
          <p class="text-green-600 font-bold mt-1">
            $ {{ (item.price * item.quantity).toFixed(2) }}
          </p>

          <div class="mt-3 flex items-center space-x-2">
            <button
              @click="decreaseQuantity(item.id)"
              :disabled="item.quantity === 1"
              class="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-md font-bold flex items-center justify-center disabled:opacity-50"
            >
              –
            </button>
            <input
              type="number"
              v-model.number="item.quantity"
              @blur="validateQuantity(item)"
              class="w-14 text-center border rounded-md py-1"
              min="1"
            />
            <button
              @click="increaseQuantity(item.id)"
              class="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-md font-bold flex items-center justify-center"
            >
              +
            </button>
          </div>
        </div>

        <button
          @click="removeFromCart(item.id)"
          class="ml-4 text-white bg-red-600 hover:bg-red-700 rounded-md px-4 py-2 font-semibold transition"
        >
          Remover
        </button>
      </div>

      <div class="text-right mt-6 border-t pt-6">
        <p class="text-2xl font-bold text-gray-800">
          Total: <span class="text-green-600">$ {{ total.toFixed(2) }}</span>
        </p>
      </div>

      <div class="text-right mt-4">
        <button
          @click="buyCart"
          :disabled="cart.length === 0"
          class="bg-green-600 hover:bg-green-700 text-white py-3 px-8 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Finalizar Compra
        </button>
      </div>
    </div>

    <div
      v-if="purchaseSuccess"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="bg-white p-8 rounded-lg text-center max-w-sm mx-auto">
        <h3 class="text-2xl font-bold mb-4 text-green-700">
          Sua compra foi feita com Sucesso! 🎉
        </h3>
        <button
          @click="purchaseSuccess = false"
          class="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded"
        >
          Fechar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'

const cart = ref([])
const purchaseSuccess = ref(false)

function loadCart() {
  const saved = localStorage.getItem('cart')
  cart.value = saved ? JSON.parse(saved) : []
  cart.value.forEach(item => {
    if (!item.quantity || item.quantity < 1) item.quantity = 1
  })
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart.value))
}

function removeFromCart(id) {
  cart.value = cart.value.filter(item => item.id !== id)
}

function increaseQuantity(id) {
  const item = cart.value.find(i => i.id === id)
  if (item) {
    item.quantity++
  }
}

function decreaseQuantity(id) {
  const item = cart.value.find(i => i.id === id)
  if (item && item.quantity > 1) {
    item.quantity--
  }
}

function validateQuantity(item) {
  if (item.quantity < 1 || isNaN(item.quantity)) {
    item.quantity = 1
  }
}

const total = computed(() =>
  cart.value.reduce((acc, item) => acc + item.price * item.quantity, 0)
)

function buyCart() {
  if (cart.value.length === 0) {
    alert('Seu carrinho está vazio.')
    return
  }
  purchaseSuccess.value = true
  cart.value = []
}

watch(cart, saveCart, { deep: true })

onMounted(loadCart)

watch(cart, saveCart, { deep: true })
</script>
