<template>
    <div class="app-container">

        <h2 style="text-align: center;">发布新课程</h2>

        <!--步骤条 开始-->
        <el-steps :active="3" process-status="wait" align-center style="margin-bottom: 40px;">
            <el-step title="填写课程基本信息" icon="el-icon-edit"/>
            <el-step title="创建课程大纲" icon="el-icon-document"/>
            <el-step title="最终发布" icon="el-icon-upload"/>
        </el-steps>
        <!--步骤条 结束-->

       <!-- 课程发布信息  开始-->
        <div class="ccInfo">
            <img :src="publishCourse.cover">
            <div class="main">
                <h2>{{ publishCourse.title }}</h2>
                <p class="gray"><span>共{{ publishCourse.lessonNum }}课时</span></p>
                <p><span>所属分类：{{ publishCourse.subjectLevelOne }} — {{ publishCourse.subjectLevelTwo }}</span></p>
                <p>课程讲师：{{ publishCourse.teacherName }}</p>
                <h3 class="red">￥{{ publishCourse.price }}</h3>
            </div>
        </div>
        <!-- 课程发布信息  结束-->

        <!--表单开始-->
        <el-form label-width="120px">

            <el-form-item>
                <el-button @click="previous">返回修改</el-button>
                <el-button :disabled="saveBtnDisabled" type="primary" @click="publish">发布课程</el-button>
            </el-form-item>
        </el-form>
        <!--表单结束-->

    </div>
</template>

<script>

    import course from "@/api/edu/course";

    export default {

        data() {

            return {

                saveBtnDisabled: false, // 是否禁用按钮
                courseId: '',           // 课程id
                publishCourse: {}       // 课程发布对象
            }
        },
        created() {

            // 获取路由中 课程id 的值
            if (this.$route.params && this.$route.params.id) {

                this.courseId = this.$route.params.id;
            }

            //调用接口方法，根据id查询课程发布信息
            this.getPublishCourseInfo();
        },
        methods: {

            // 点击上一步，返回信息编辑页面
            previous() {

                // 点击上一步，返回信息编辑页面
                this.$router.push({path: "/course/chapter/1"});
            },

            // 点击发布
            publish() {

                this.$confirm('您点击的是发布该课程信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {   // 点击了确认发布按钮
                    course.submitPublishCourse(this.courseId)
                        .then(response => {

                            // 提示信息,弹出一个提示框
                            this.$message({
                                type: 'success',
                                message: '该课程发布成功!'
                            });

                            // 跳转到课程列表页面
                            this.$router.push({path: "/course/list"});
                        })
                });
            },

            //调用接口方法，根据id查询课程发布信息
            getPublishCourseInfo() {
                course.getPublishCourseInfo(this.courseId)
                    .then(response => {

                        this.publishCourse = response.data.publishCourse;
                    })
            }
        }
    }
</script>

<style scoped>

    .ccInfo {
        background: #f5f5f5;
        padding: 20px;
        overflow: hidden;
        border: 1px dashed #DDD;
        margin-bottom: 40px;
        position: relative;
    }
    .ccInfo img {
        background: #d6d6d6;
        width: 500px;
        height: 278px;
        display: block;
        float: left;
        border: none;
    }
    .ccInfo .main {
        margin-left: 520px;
    }

    .ccInfo .main h2 {
        font-size: 28px;
        margin-bottom: 30px;
        line-height: 1;
        font-weight: normal;
    }
    .ccInfo .main p {
        margin-bottom: 10px;
        word-wrap: break-word;
        line-height: 24px;
        max-height: 48px;
        overflow: hidden;
    }

    .ccInfo .main p {
        margin-bottom: 10px;
        word-wrap: break-word;
        line-height: 24px;
        max-height: 48px;
        overflow: hidden;
    }
    .ccInfo .main h3 {
        left: 540px;
        bottom: 20px;
        line-height: 1;
        font-size: 28px;
        color: #d32f24;
        font-weight: normal;
        position: absolute;
    }
</style>
