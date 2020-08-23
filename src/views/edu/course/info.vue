<template>
    <div class="app-container">

        <h2 style="text-align: center;">发布新课程</h2>

        <!--步骤条 开始-->
        <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
            <el-step title="填写课程基本信息" icon="el-icon-edit"/>
            <el-step title="创建课程大纲" icon="el-icon-document"/>
            <el-step title="最终发布" icon="el-icon-upload"/>
        </el-steps>
        <!--步骤条 结束-->

        <!--表单开始-->
        <el-form label-width="120px">

            <!--课程标题-->
            <el-form-item label="课程标题">
                <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
            </el-form-item>

            <!-- 所属分类  级联下拉 [一级分类，二级分类]-->
            <el-form-item label="课程分类">

                <!-- 一级分类 -->
                <el-select
                    v-model="courseInfo.subjectParentId"
                    placeholder="一级分类"
                    @change="oneSubjectChange"> <!--当一级分类的值改变时触发事件-->

                    <!--:label="subject.title" &ndash;&gt;用来显示的值， :value="subject.id--》传入数据库中的值-->
                    <el-option
                        v-for="subject in oneSubjectList"
                        :key="subject.id"
                        :label="subject.title"
                        :value="subject.id"/>
                </el-select>

                <!-- 二级分类 -->
                <el-select v-model="courseInfo.subjectId" placeholder="二级分类">
                    <el-option
                        v-for="subject in twoSubjectList"
                        :key="subject.id"
                        :label="subject.title"
                        :value="subject.id"/>
                </el-select>
            </el-form-item>

            <!-- 课程讲师  -->
            <el-form-item label="课程讲师">
                <el-select
                    v-model="courseInfo.teacherId"
                    placeholder="请选择">

                    <!--:label="teacher.name" &ndash;&gt;用来显示的值， :value="teacher.id--》传入数据库中的值-->
                    <el-option
                        v-for="teacher in teacherList"
                        :key="teacher.id"
                        :label="teacher.name"
                        :value="teacher.id"/>
                </el-select>
            </el-form-item>

            <!-- 课程课时 -->
            <el-form-item label="总课时">
                <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
            </el-form-item>

            <!-- 课程简介-->
            <el-form-item label="课程简介">
                <tinymce :height="300" v-model="courseInfo.description"/>
            </el-form-item>

            <!-- 课程封面 -->
            <el-form-item label="课程封面">

                <!-- 上传封面
                    :show-file-list="true"      -- 是否显示文件列表
                    :auto_upload = "false"      -- 自动上传
                    :on-success="handleAvatarSuccess"   --上传成功
                    :before-upload="beforeAvatarUpload" --上传之前
                    :action="BASE_API+'/admin/oss/file/upload?host=cover'"  --接口地址
                    class="avatar-uploader">    --样式
                    <img :src="courseInfo.cover">
                -->
                <el-upload
                    :show-file-list="true"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                    :action="BASE_API+'/eduoss/fileoss'"
                    class="avatar-uploader">
                    <img :src="courseInfo.cover" style="width: 500px; height: 260px;">
                </el-upload>

            </el-form-item>

            <!--课程价格-->
            <el-form-item label="课程价格">
                <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/> 元
            </el-form-item>

            <!--保存并下一步-->
            <el-form-item>
                <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存并下一步</el-button>
            </el-form-item>

        </el-form>
        <!--表单结束-->

    </div>
</template>

<script>

    import course from "@/api/edu/course";
    import subject from "@/api/edu/subject";
    import Tinymce from "@/components/Tinymce"; // 引入富文本

    export default {

        // 引入富文本组件
        components: { Tinymce },

        data() {

            return {

                saveBtnDisabled: false, // 是否禁用按钮

                courseInfo: {           // 课程信息对象
                    title: '',          // 课程标题
                    subjectId: '',      // 二级分类ID
                    subjectParentId: '',// 一级分类ID
                    teacherId: '',      // 课程讲师ID
                    lessonNum: 0,       // 总课时
                    description: '',    // 课程简介
                    cover: 'static/luo.jpg',          // 课程封面图片路径
                    price: 0            // 课程销售价格，设置为0则可免费观看
                },

                teacherList: [],        // 用于封装所有的讲师
                oneSubjectList: [],     // 用于封装所有的 一级分类
                twoSubjectList: [],     // 用于封装所有的 二级分类
                BASE_API: process.env.BASE_API,  // 获取dev.env.js里面地址
                courseId: ''            // 路由中的课程id
            }
        },
        created() {

            this.init();
        },
        watch: {  // 路由监听

            $route(to, from) {  // 当路由发生变化，这个方法就会执行

                console.log('watch $route');
                this.init();
            }
        },
        methods: {

            // 初始化
            init() {

                // 修改课程信息操作
                // 1、获取路由中的课程id   如果路由中有参数，且存在参数为id
                if (this.$route.params && this.$route.params.id) {

                    this.courseId = this.$route.params.id;

                    // 2、调用根据id查询课程的方法
                    this.getCourseInfo();

                    // 3、初始化所有讲师
                    this.getTeacherList();
                }
                // 新增课程信息操作
                else {

                    // this.courseInfo = {};

                    // 2、初始化所有讲师
                    this.getTeacherList();

                    // 3、初始化一级分类
                    this.getOneSubjectList();

                }
            },

            // 添加或修改课程信息
            saveOrUpdate() {

                // 根据条件判断是执行 新增信息方法 还是 修改信息方法
                if (this.courseId) {

                    // 执行修改信息方法
                    this.updateCourse();
                }
                else {

                    // 执行新增信息方法
                    this.addCourse();
                }

            },

            // 查询所有讲师信息
            getTeacherList() {

                course.getTeacherList()
                    .then(response =>{

                        // 将所有的讲师信息装进数组中
                        this.teacherList = response.data.items;
                    })
            },

            // 查询所有的一级分类
            getOneSubjectList() {

                subject.getSubjectList()
                    .then(response =>{

                        // 将所有的一级分类信息装进数组中
                        this.oneSubjectList = response.data.list;
                    })
            },

            // 当一级分类的值发生改变时，触发change事件，获取对应的二级分类
            oneSubjectChange(value) {

                // value 就是一级分类的ID
                // alert("value:"+value);

                // 点击时清除二级分类数据
                this.courseInfo.subjectId = '';

                // 遍历所有的分类，包括一级和二级
                for (let i = 0; i < this.oneSubjectList.length; i++) {

                    // 获取所有的一级分类
                    let oneSubject = this.oneSubjectList[i];

                    if (value == oneSubject.id) {

                        // 给二级分类赋值
                        this.twoSubjectList = oneSubject.children;
                    }
                }
            },

            // 上传封面成功调用的方法
            handleAvatarSuccess(res, file) {

                // // 上传响应
                // console.log(res);
                // // base64编码
                // console.log(URL.createObjectURL(file.raw));

                // 上传成功返回的地址
                this.courseInfo.cover = res.data.url;
            },

            // 上传封面之前调用的方法 限定上传的文件类型及大小
            beforeAvatarUpload(file) {

                // 限定格式
                const isJPG = file.type === 'image/jpeg';
                // 限定图片大小
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    this.$message.error('上传课程封面图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传课程封面图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },

            // 根据课程id查询信息
            getCourseInfo() {

                course.getCourseInfo(this.courseId)
                    .then(response =>{

                         // courseInfo 中会有课程相关的信息
                        this.courseInfo = response.data.courseInfo;

                        // 目前，是 oneSubjectList 数组中有值，但是 twoSubjectList 中没有值，所有下拉列表中只会显示id值
                        // 解决方法
                        // 1、先查询出所有的一级二级分类（这个方法是查询出所有的一级分类一级二级分类的方法）
                        subject.getSubjectList()
                            .then(response =>{

                                // 2、获取所有的一级分类
                                this.oneSubjectList = response.data.list;

                                //3 把所有的一级分类数组进行遍历，比较当前courseInfo里面的一级分类id和所有的一级分类id
                                // 相同的话，取出其中的二级分类id进行回显
                                for (let i = 0; i < this.oneSubjectList.length; i++) {

                                    // 在一级分类数组中取出每一个一级分类
                                    let oneSubject = this.oneSubjectList[i];

                                    // 比较当前courseInfo里面一级分类id和所有的一级分类id
                                    // courseInfo 中只有根据id查出来的已经选择好的一级分类一级二级分类
                                    if(this.courseInfo.subjectParentId == oneSubject.id) {

                                        //获取该一级分类所有的二级分类
                                        this.twoSubjectList = oneSubject.children;
                                    }
                                }

                            })
                    })
            },

            // 新增课程信息方法
            addCourse() {

                course.addCourseInfo(this.courseInfo)
                    .then(response =>{

                        // 提示信息,弹出一个提示框
                        this.$message({
                            type: 'success',
                            message: '添加课程信息成功!'
                        });

                        // 从 response 中获取到课程id
                        let courseId = response.data.courseId;

                        // 点击下一步跳转到第二步     路由跳转(重定向)
                        this.$router.push({path: "/course/chapter/"+ courseId });
                    })
            },

            // 修改课程信息的方法
            updateCourse() {

                course.updateCourseInfo(this.courseInfo)
                    .then(response =>{

                        // 提示信息,弹出一个提示框
                        this.$message({
                            type: 'success',
                            message: '修改课程信息成功!'
                        });

                        // 点击下一步跳转到第二步     路由跳转(重定向)
                        this.$router.push({path: "/course/chapter/"+ this.courseId });
                    })
            }
        }
    }
</script>

<style scoped>

    /*富文本样式
      scoped 表示这个样式只对当前页面有效
    */
    .tinymce-container {
        line-height: 29px;
    }

</style>
