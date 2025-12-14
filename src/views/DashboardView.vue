<template>
  <div class="p-8 animate-in">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-black text-green-800">LỊCH HỌC: {{ mssv }}</h1>
      <button @click="$emit('logout')" class="text-rose-600 font-bold">Đăng xuất</button>
    </div>
    <div class="bg-white rounded-3xl shadow-xl overflow-hidden border border-green-50">
      <table class="w-full text-left">
        <thead class="bg-green-600 text-white">
          <tr>
            <th class="p-5">Thứ</th>
            <th class="p-5">Môn học</th>
            <th class="p-5">Phòng</th>
            <th class="p-5 text-center">Tiết</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in data" :key="item.id" class="border-b border-green-50 hover:bg-green-50">
            <td class="p-5 font-bold">{{ item.thu === 8 ? 'Chủ Nhật' : 'Thứ ' + item.thu }}</td>
            <td class="p-5 font-medium">{{ item.tenMon }}</td>
            <td class="p-5">{{ item.phong }}</td>
            <td class="p-5 text-center">{{ item.tietBatDau }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
defineProps(['data', 'mssv']);
defineEmits(['logout']);
</script>