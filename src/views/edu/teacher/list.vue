<template>
    <div class="app-container">
        讲师列表

        <!--条件查询表单开始-->
        <el-form :inline="true" class="demo-form-inline"> <!-- :inline="true" 代表在一行显示 -->

            <el-form-item>
                <el-input v-model="teacherQuery.name" placeholder="讲师名"/>
            </el-form-item>

            <el-form-item>
                <el-select v-model="teacherQuery.level" clearable placeholder="讲师头衔">
                    <el-option value="1" label="高级讲师"/>
                    <el-option value="2" label="首席讲师"/>
                </el-select>
            </el-form-item>

            <el-form-item label="添加时间">
                <el-date-picker
                    v-model="teacherQuery.begin"
                    type="datetime"
                    placeholder="选择开始时间"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    default-time="00:00:00"
                />
            </el-form-item>

            <el-form-item>
                <el-date-picker
                  v-model="teacherQuery.end"
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
            highlight-current-row >

            <el-table-column
                label="序号"
                width="70"
                align="center">
                <template slot-scope="scope">
                    <!-- 固定的算法，得到 1,2,3,4,5....
                          scope 代表整个表格的内容  能取到表中所有数据（行、列）-->
                    {{ (page - 1) * limit + scope.$index + 1 }}
                </template>
            </el-table-column>

            <el-table-column prop="name" label="名称" width="80"/>

            <el-table-column label="头衔" width="80">
                <template slot-scope="scope">
                    {{ scope.row.level===1?'高级讲师':'首席讲师' }}
                </template>
            </el-table-column>

            <el-table-column prop="intro" label="资历"/>

            <el-table-column prop="gmtCreate" label="添加时间" width="160"/>

            <el-table-column prop="sort" label="排序" width="60"/>

            <el-table-column label="操作" width="200" align="center">
                <template slot-scope="scope">
                    <router-link :to="'/teacher/edit/'+scope.row.id">
                        <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
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

<!--=================================================================================================================-->
<script>
    // 引入 teacher.js 文件
    import teacher from "@/api/edu/teacher";

    export default {

        // 写核心代码位置
        data() {      // 定义变量和初始值

            return{

                list: null,     // 查询之后返回的结果集合
                page: 1,        // 当前页，默认从第一页开始
                limit: 3,       // 每页显示10条记录
                total: 0,       // 总页数
                teacherQuery:{  // 查询条件封装的对象,里面可以什么都不写，会进行自动装配
                    name: null, // 讲师姓名
                    level: null, // 讲师头衔
                    begin: null, // 开始时间
                    end: null,   // 结束时间
                }
            }
        },
        created() {   // 页面渲染之前执行，一般调用methods定义的方法

            //调用方法
            this.getList();
        },
        methods:{     // 创建具体的方法，调用teacher.js定义的方法

            // 根据条件分页查询
            getList(page = 1) {

                // 分页条封装了方法，传入page参数即可自动实现
                this.page = page;
                teacher.getTeacherListPage(this.page, this.limit, this.teacherQuery)
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

                    })
                    .catch(error => {    // 请求失败

                      console.log(error);
                    })
            },

            // 清空查询条件
            resetData() {

                // 1、清空表单数据, 将对象置为空即可，因为是双向绑定
                this.teacherQuery = {};

                // 2、查询所有数据，调用之前的方法
                this.getList();
            },

            // 通过id删除讲师信息
            removeDataById(id) {

                this.$confirm('此操作将永久删除讲师信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {   // 点击了确认删除按钮

                    teacher.deleteTeacherId(id)
                        .then(response =>{  // 删除成功

                            // 提示信息,弹出一个提示框
                            this.$message({
                              type: 'success',
                              message: '删除成功!'
                            });

                            // 刷新数据
                            this.getList();

                        })
                        .catch(error =>{  // 删除失败   注意：框架已经是自己封装了catch，所以以后可以不用自己再定义catch，避免发生同时执行两个catch

                            alert("删除失败："+error);
                        })

                }).catch(() => {  // 点击了取消删除按钮
                    this.$message({
                        type: 'info',
                        message: '已取消删除！'
                    });
                });

            }
        }
    }
</script>

