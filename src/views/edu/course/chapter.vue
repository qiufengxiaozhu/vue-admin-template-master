<template>
    <div class="app-container">

        <h2 style="text-align: center;">发布新课程</h2>

        <!--步骤条 开始-->
        <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
            <el-step title="填写课程基本信息" icon="el-icon-edit"/>
            <el-step title="创建课程大纲" icon="el-icon-document"/>
            <el-step title="最终发布" icon="el-icon-upload"/>
        </el-steps>
        <!--步骤条 结束-->

        <!--表单开始-->
        <el-form label-width="120px">

            <el-form-item>
                <el-button @click="previous">上一步</el-button>
                <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
            </el-form-item>
        </el-form>
        <!--表单结束-->

    </div>
</template>

<script>
    export default {

        data() {

            return {

                saveBtnDisabled: false, // 是否禁用按钮
            }
        },
        created() {

        },
        methods: {

            previous() {

                // 点击上一步，返回信息编辑页面
                this.$router.push({path: "/course/info/1"});
            },

            next() {

                // 点击下一步     路由跳转(重定向)
                this.$router.push({path: "/course/publish/1"});
            }
        }
    }
</script>

<style scoped>

</style>
