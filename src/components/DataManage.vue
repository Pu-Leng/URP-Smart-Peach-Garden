<script setup lang="ts">
import { reactive, ref } from 'vue'
import axios from 'axios'
import { rsGetRawList } from '@/api/raster.js'
import UploadChunks from '@/components/UploadChunks.vue'
import { openMessage } from '@/utils/elmessage'


const resourceData = ref([
  {
    value: 'resource-1',
    label: 'Sential-2'
  },
  {
    value: 'resource-2',
    label: 'Landsat8'
  }
])
const tableColumn = ref([
  {
    prop: 'name',
    label: '影像名称'
  },
  {
    prop: 'date',
    label: '成像日期'
  },
  {
    prop: 'band_count',
    label: '波段数'
  },
  {
    prop: 'srid',
    label: 'EPSG'
  },
  {
    prop: 'rsplatform',
    label: '遥感卫星平台'
  },
  {
    prop: 'upload_account',
    label: '上传账户'
  },
  {
    prop: 'desc',
    label: '备注'
  }
])
const tableData = ref([{
    "rid": "2",
    "name": 'haha',
    "date": null,
    "band_count": null,
    "srid": null,
    "rsplatform": null,
    "upload_account": "admin",
    "desc": null
}])

const form = reactive({
  name: '',
  date: '',
  rsplatform: '',
  upload_account: '',
  desc: ''
})

import { onMounted } from 'vue'
// import qs from 'qs'
// import map from 'lodash/map'
// import find from 'lodash/find'
import _ from 'lodash'


// const onSubmit = () => {
//   // const formData = JSON.parse(JSON.stringify(form))
//   // console.log(formData)
//   // console.log(qs.stringify({
//   //       ...formData,
//   //       type: formData.type.join(','),
//   //       id: new Date().getTime()
//   //     }))
//   const formData = {
//     ...form,
//     // id: new Date().getTime()
//     // rid将会在数据传输到后端后自动生成
//   }
//   console.log(formData)
//   axios
//     .post(
//       'http://localhost:3001/user/insert-data',
//       // qs.stringify({
//       //   ...formData,
//       //   type: formData.type.join(','),
//       //   id: new Date().getTime()
//       // })
//       formData
//     )
//     .then((res) => {
//       // console.log(res.data)
//       openMessage('数据入库成功', 'success')
//       getRawRsData()
//     })
//     .catch((err) => {
//       console.error('err', err)
//       openMessage('数据入库失败', 'error')
//       console.error('Error:', err.response.data)
//     })
// }



const getRawRsData = async () => {
  try {
    const res = await rsGetRawList().then(response =>{
      tableData.value = response.data
      // console.log('API response:', response.data)
  })
  } catch (error) {
    console.error('Error fetching raw raster data:', error)
    openMessage("服务器连接异常", error)
    // 处理错误，显示通知给用户
  }
}

onMounted(() => {
  getRawRsData()
//  console.log('API response:', rsGetRawList())
  // console.log('tableData:' + tableData.value)
})
</script>

<template>
  <div class="data-manage">
    <div class="data-manage-form">
      <div class="data-manage-header">
        <el-alert title="填入以下信息后上传遥感影像数据进行数据入库" type="info" show-icon />
      </div>
      <el-form :model="form" label-width="auto" style="max-width: 600px">
        <el-form-item label="影像名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="成像日期">
          <el-date-picker v-model="form.date" type="date" placeholder="请选择该景影像成像日期" style="width: 60%" />
        </el-form-item>
        <el-form-item label="遥感卫星平台">
          <el-radio-group v-model="form.rsplatform">
            <el-radio v-for="item in resourceData" :key="item.value" :label="item.value">{{
              item.label
            }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传影像">
          <upload-chunks/>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.desc" type="textarea" />
        </el-form-item>
        <el-form-item>
          <!--<el-button type="primary" @click="onSubmit">提交</el-button>-->
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="data-manage-table">
      <!-- <div class="data-manage-header"> -->
        <!-- <el-alert title="入库数据反显" type="info" show-icon /> -->
      <!-- </div> -->
      <el-table :data="tableData" height=100% style="width: 100%" empty-text="暂无数据">
        <el-table-column
          v-for="item in tableColumn"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
        />
      </el-table>
    </div>
  </div>
</template>

<style scoped>
.data-manage {
  width: 100%;
  height: 100%;
  display: flex;
  padding: 16px;
  box-sizing: border-box;
}
.data-manage-header {
  margin-bottom: 16px;
}
.data-manage-form {
  width: 480px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  margin-right: 8px;
  padding: 16px;
  box-sizing: border-box;
}
.data-manage-table {
  flex: 1;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 16px;
  box-sizing: border-box;
}
</style>