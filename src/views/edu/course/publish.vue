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
                this.$router.push({path: "/course/chapter/1"});
            },

            publish() {

                // 点击发布
                this.$router.push({path: "/course/list"});
            }
        }
    }
</script>

<style scoped>

</style>
