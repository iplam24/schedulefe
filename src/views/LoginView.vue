<template>
  <div class="flex items-center justify-center min-h-screen bg-green-50">
    <div class="max-w-md w-full bg-white rounded-3xl p-10 shadow-xl border border-green-100">
      <h2 class="text-2xl font-black text-green-700 text-center mb-6">ĐĂNG NHẬP</h2>
      <div class="space-y-4">
        <input v-model="mssv" type="text" placeholder="MSSV" class="w-full p-4 bg-slate-50 rounded-xl outline-none border-2 focus:border-green-400">
        <input v-model="password" type="password" placeholder="Mật khẩu" class="w-full p-4 bg-slate-50 rounded-xl outline-none border-2 focus:border-green-400">
        <button @click="onLogin" :disabled="loading" class="w-full bg-green-600 text-white py-4 rounded-xl font-bold">
          {{ loading ? 'ĐANG ĐỒNG BỘ...' : 'ĐĂNG NHẬP' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const props = defineProps(['loading']);
const emit = defineEmits(['login']);
const mssv = ref('');
const password = ref('');

const onLogin = () => emit('login', { mssv: mssv.value, password: password.value });
</script>