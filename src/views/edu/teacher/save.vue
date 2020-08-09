<template>
    <div class="app-container">
        添加讲师

        <!--添加讲师表单开始-->
        <el-form label-width="120px">

            <el-form-item label="讲师名称">
                <el-input v-model="teacher.name"/>
            </el-form-item>

            <el-form-item label="讲师排序">
                <el-input-number v-model="teacher.sort" controls-position="right" :min="0" :max="10"/>
            </el-form-item>

            <el-form-item label="讲师头衔">
                <el-select v-model="teacher.level" clearable placeholder="请选择">
                    <!--
                    数据类型一定要和取出的json中的一致，否则没法回填
                    因此，这里value使用动态绑定的值，保证其数据类型是number
                    -->
                    <el-option :value="1" label="高级讲师"/>
                    <el-option :value="2" label="首席讲师"/>
                </el-select>
            </el-form-item>

            <el-form-item label="讲师资历">
                <el-input v-model="teacher.career"/>
            </el-form-item>

            <el-form-item label="讲师简介">
                <el-input v-model="teacher.intro" :rows="10" type="textarea"/>
            </el-form-item>

            <!-- 讲师头像 -->
            <el-form-item label="讲师头像">
                <!-- 头衔缩略图 -->
                <pan-thumb :image="teacher.avatar"/>
                <!-- 文件上传按钮 -->
                <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">
                    更换头像
                </el-button>
                <!--
                   v-show：是否显示上传组件
                   :key：类似于id，如果一个页面多个图片上传控件，可以做区分
                   :url：后台上传的url地址  http://localhost:9900/eduoss/fileoss
                   @close：关闭上传组件
                   @crop-upload-success：上传成功后的回调
                -->
                <image-cropper
                    v-show="imagecropperShow"
                    :width="300"
                    :height="300"
                    :key="imagecropperKey"
                    :url="BASE_API+'/eduoss/fileoss'"
                    field="file"
                    @close="close"
                    @crop-upload-success="cropSuccess"/>
            </el-form-item>
            <!-- 讲师头像 结束-->

            <el-form-item>
                <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate()">
                    保存
                </el-button>
            </el-form-item>

        </el-form>
        <!--添加讲师表单结束-->

    </div>
</template>

<script>

    // 引入teacher对象的增删改查方法
    import teacherApi from "@/api/edu/teacher";

    // 引入图片上传组件
    import ImageCropper from '@/components/ImageCropper';
    import PanThumb from '@/components/PanThumb';

    export default {

        // 声明文件上传组件
        components: { ImageCropper, PanThumb },

        data() {

            return {

                teacher:{
                    name: '',     // 讲师姓名
                    sort: 0,      // 排序
                    level: 1,     // 头衔 1高级讲师 2首席讲师
                    career: '',   // 讲师资历,一句话说明讲师
                    intro: '',    // 讲师简介
                    // 讲师头像,如果用户不上传，给他一个默认的头像，在初始化方法里设置
                    avatar: ''
                },

                imagecropperShow: false,  // 上传弹框组件是否显示，默认false
                imagecropperKey: 0,       // 类似于id，如果一个页面多个图片上传控件，可以做区分
                BASE_API:process.env.BASE_API, // 获取dev.env.js里面地址
                saveBtnDisabled: false    // 保存按钮是否禁用,在点击了保存按钮之后，不允许再次点击，避免重复提交

            }
        },
        created() { // 页面渲染之前执行，一般调用methods定义的方法
            this.init();
        },
        watch: {  // 路由监听

            $route(to, from) {  // 当路由发生变化，这个方法就会执行

                console.log('watch $route');
                this.init();
            }
        },
        methods: {

            // init
            init() {

                //判断路径是否有id值
                if (this.$route.params && this.$route.params.id) {

                    // 从路径获取id值
                    const id = this.$route.params.id;
                    // 调用根据id查询讲师信息的方法
                    this.getInfo(id);
                } else {

                    // 路径中没有id值，代表是做添加操作，清空表单数据，然后给头像一个默认值
                    this.teacher = {avatar :process.env.OSS_PATH + process.env.AVATAR_URL};

                    // 理论上这样是可行的，但是最终效果还是没有清空表单数据，为什么呢？
                    // 因为： 多次路由到同一个页面，在页面中 created() 方法，只会执行一次。后面再进行跳转时，不会执行。
                    // 最终解决方式， 使用 Vue中的监听
                    //         1、我们可以在watch中监听路由的变化，当路由变化时，重新调用created中的内容
                    //         2、在init方法中我们判断路由的变化，如果是修改路由，则从api获取表单数据，
                    //         如果是新增路由，则重新初始化表单数据

                }
            },
            // 添加或修改讲师, 保存按钮触发的点击事件，修改或添加公用的按钮
            saveOrUpdate() {

                // 保存按钮禁用
                this.saveBtnDisabled = true;

                // 判断此时应该调用的是添加方法还是修改方法
                // 可以根据 teacher 对象中是否有id值判断  有--》修改方法，没有--》添加方法
                if(!this.teacher.id) {
                    // 添加讲师
                    this.saveTeacher();
                } else {
                    // 修改讲师
                    this.updateTeacher();
                }
            },

            // 添加讲师
            saveTeacher() {

                teacherApi.addTeacher(this.teacher)
                    .then(response => {   // 新增成功

                        // 提示信息,弹出一个提示框
                        this.$message({
                          type: 'success',
                          message: '新增成功!'
                        });

                        // 回到列表页面 ==》路由跳转(重定向)
                        this.$router.push({path:'/teacher/table'});
                    });

            },

            // 根据id查询讲师信息
            getInfo(id) {

                teacherApi.getTeacherInfo(id)
                    .then(response => {

                        this.teacher = response.data.teacher;
                    })
            },

            // 修改讲师信息的方法
            updateTeacher() {

                teacherApi.updateTeacherInfo(this.teacher)
                    .then(response => {

                        // 提示信息,弹出一个提示框
                        this.$message({
                          type: 'success',
                          message: '修改成功!'
                        });

                        // 回到列表页面 ==》路由跳转(重定向)
                        this.$router.push({path:'/teacher/table'});
                    })
            },

            close() { //关闭上传弹框的方法

                this.imagecropperShow = false;

                //上传组件初始化
                this.imagecropperKey = this.imagecropperKey+1;
            },

            //上传成功方法
            cropSuccess(data) {

                this.imagecropperShow=false;

                //上传之后接口返回图片地址
                this.teacher.avatar = data.url;
                this.imagecropperKey = this.imagecropperKey+1;
            }

        }
    }
</script>

