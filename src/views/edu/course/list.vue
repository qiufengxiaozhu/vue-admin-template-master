<template>
    <div class="app-container">
        课程列表

        <!--条件查询表单开始-->
        <el-form :inline="true" class="demo-form-inline"> <!-- :inline="true" 代表在一行显示 -->

            <el-form-item>
                <el-input v-model="courseQuery.title" placeholder="课程名称"/>
            </el-form-item>

            <el-form-item>
                <el-select v-model="courseQuery.status" clearable placeholder="课程状态">
                    <el-option :value="Normal" label="已发布"/>
                    <el-option :value="Draft" label="未发布"/>
                </el-select>
            </el-form-item>

            <el-form-item label="添加时间">
                <el-date-picker
                    v-model="courseQuery.begin"
                    type="datetime"
                    placeholder="选择开始时间"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    default-time="00:00:00"
                />
            </el-form-item>

            <el-form-item>
                <el-date-picker
                    v-model="courseQuery.end"
                    type="datetime"
                    placeholder="选择截止时间"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    default-time="00:00:00"
                />
            </el-form-item>

            <el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>

            <el-button type="default" @click="resetData()">清空</el-button>

        </el-form>
        <!--条件查询表单  结束 -->

        <!-- 表格开始-->
        <!-- v-loading="listLoading" 加载图标，目前没有-->
        <el-table
            :data="list"
            element-loading-text="数据加载中"
            border
            fit
            highlight-current-row
            style="width: 100%">

            <el-table-column
                label="序号"
                width="100"
                align="center">
                <template slot-scope="scope">
                    <!-- 固定的算法，得到 1,2,3,4,5....
                          scope 代表整个表格的内容  能取到表中所有数据（行、列）-->
                    {{ (page - 1) * limit + scope.$index + 1 }}
                </template>
            </el-table-column>

            <el-table-column prop="title" label="名称" style="width: 30%"/>

            <el-table-column label="发布状态" style="width: 20%">
                <template slot-scope="scope">
                    {{ scope.row.status=='Normal'?'已发布':'未发布' }}
                </template>
            </el-table-column>

            <el-table-column prop="gmtCreate" label="创建时间" style="width: 20%"/>

            <el-table-column label="操作" style="width: 20%" align="center">
                <template slot-scope="scope">
                    <router-link :to="'/teacher/edit/'+scope.row.id">
                        <el-button type="primary" size="mini" icon="el-icon-edit">基本信息</el-button>
                    </router-link>
                    <router-link :to="'/teacher/edit/'+scope.row.id">
                        <el-button type="primary" size="mini" icon="el-icon-edit">课程大纲</el-button>
                    </router-link>
                    <el-button type="danger" size="mini" icon="el-icon-delete"
                               @click="removeDataById(scope.row.id)">删除
                    </el-button>
                </template>
            </el-table-column>

        </el-table>
        <!-- 表格结束-->

        <!-- 分页 @current-change绑定时间写成自己的方法，不能加括号-->
        <el-pagination
            background
            :current-page="page"
            :page-size="limit"
            :total="total"
            style="padding: 30px 0; text-align: center;"
            layout="total, prev, pager, next, jumper"
            @current-change="getList"
        />


    </div>
</template>

<script>

    import course from "@/api/edu/course";

    export default {
        data() {      // 定义变量和初始值

            return{

                list: null,      // 查询之后返回的结果集合
                page: 1,         // 当前页，默认从第一页开始
                limit: 5,        // 每页显示10条记录
                total: 0,        // 总页数
                courseQuery:{    // 查询条件封装的对象,里面可以什么都不写，会进行自动装配
                    title: null, // 课程名称
                    status: null,// 发布状态
                    begin: null, // 开始时间
                    end: null,   // 结束时间
                }
            }
        },
        created() {   // 页面渲染之前执行，一般调用methods定义的方法

            //调用方法
            this.getList();
        },
        methods: {     // 创建具体的方法，调用course.js定义的方法

            // 根据条件分页查询
            getList(page = 1) {

                // 分页条封装了方法，传入page参数即可自动实现
                this.page = page;
                course.selectCourseByCondition(this.page, this.limit, this.courseQuery)
                    .then(response => { // 请求成功

                        // response 接口返回数据
                        // console.log(response);

                        // 记得加上 this 关键字， 而不是定义新的变量
                        this.list = response.data.rows;
                        this.total = response.data.total;

                        // 下面这个语句会把 this.list 转换成 字符串， 需要单独写才能看出效果
                        // console.log("讲师集合：" + this.list);
                        console.log(this.list);
                        console.log("总条数：" + this.total);
                        console.log("总页数：" + response.data.page);
                    })
                    .catch(error => {    // 请求失败

                        console.log(error);
                    })
            },
        }
    }
</script>

<style scoped>

</style>
