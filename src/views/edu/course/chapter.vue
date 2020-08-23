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

            <!--创建课程大纲 开始-->
            <el-button type="success" class="el-icon-circle-plus-outline" @click="openChapterDialog()"> 添加章节</el-button>
            <!-- 章节 -->
            <ul class="chanpterList">
                <li
                    v-for="chapter in chapterAndVideo"
                    :key="chapter.id">
                    <p>
                        {{ chapter.title }}

                        <span class="acts">
                            <el-button type="text" @click="addVideo(chapter.id)">添加小节</el-button>
                            <el-button type="text" @click="editChapter(chapter.id)">编辑</el-button>
                            <el-button type="text" @click="removeChapter(chapter.id)">删除</el-button>
                        </span>
                    </p>

                    <!-- 视频 -->
                    <ul class="chanpterList videoList">
                        <li
                            v-for="video in chapter.children"
                            :key="video.id">
                            <p>{{ video.title }}
                                <span class="acts">
                                    <el-button type="text">编辑</el-button>
                                    <el-button type="text">删除</el-button>
                                </span>
                            </p>
                        </li>
                    </ul>
                </li>
            </ul>
            <!--创建课程大纲 结束-->

            <br>
            <el-form-item>
                <el-button @click="previous">上一步</el-button>
                <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
            </el-form-item>
        </el-form>
        <!--表单结束-->

        <!--模态框  添加和修改章节表单 -->
        <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
            <el-form :model="chapter" label-width="120px">
                <el-form-item label="章节标题">
                    <el-input v-model="chapter.title"/>
                </el-form-item>
                <el-form-item label="章节排序">
                    <el-input-number v-model="chapter.sort" :min="0" controls-position="right"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
            </div>
        </el-dialog>
        <!--模态框  添加和修改章节表单  结束-->

        <!-- 添加和修改小节表单 开始 -->
        <el-dialog :visible.sync="dialogVideoFormVisible" title="添加小节">
            <el-form :model="video" label-width="120px">
                <el-form-item label="小节标题">
                    <el-input v-model="video.title"/>
                </el-form-item>
                <el-form-item label="小节排序">
                    <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
                </el-form-item>
                <el-form-item label="是否免费">
                    <el-radio-group v-model="video.free">
                        <el-radio :label="true">免费</el-radio>
                        <el-radio :label="false">默认</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="上传视频">
                    <!-- TODO -->
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
                <el-button :disabled="saveVideoBtnDisabled" type="primary" @click="saveOrUpdateVideo">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 添加和修改小节表单 结束 -->
    </div>
</template>

<script>

    import chapter from "@/api/edu/chapter";

    export default {

        data() {

            return {

                saveBtnDisabled: false, // 是否禁用按钮
                chapterAndVideo: [],    // 章节以及小节
                courseId: '',           // 课程id

                dialogChapterFormVisible: false,    // 初始化模态框是否可见 （添加章节的弹框）
                dialogVideoFormVisible: false,      // 初始化模态框是否可见 （添加小节的弹框）

                chapter: {              // 用于封装章节的数据
                    title: '',          // 章节名称
                    sort: 0             // 排序
                },
                video: {                // 用于封装小节的数据
                    title: '',          // 章节名称
                    sort: 0,            // 排序
                    free: 0,            // 是否免费
                    videoSourceId: ''   // 小节的视频资源
                }
            }
        },
        created() {

            // 获取路由中的课程id   如果路由中有参数，且存在参数为id
            if (this.$route.params && this.$route.params.id) {

               this.courseId = this.$route.params.id;

                // 根据id查询章节、小节
                this.getChapterAndVideo();
            }

        },
        methods: {

            // 点击上一步
            previous() {

                // 点击上一步，返回信息编辑页面
                this.$router.push({path: "/course/info/"+ this.courseId});
            },

            // 点击下一步
            next() {

                // 点击下一步     路由跳转(重定向)
                this.$router.push({path: "/course/publish/"+ this.courseId});
            },

            /*========================================【章节操作】 -- 开始 =====================================*/
            // 根据id查询章节、小节
            getChapterAndVideo() {

                chapter.getAllChapterVideo(this.courseId)
                    .then(response =>{

                       this.chapterAndVideo = response.data.chapterAndVideo;
                    })
            },

            // 添加或修改章节
            saveOrUpdate() {

                // 判断，如果数据中有 id，则为修改方法，没有id，调用添加方法
                if (this.chapter.id) {
                    // 修改章节的方法
                    this.updateChapter();
                }
                else {
                    // 添加章节的方法
                    this.addChapter();
                }

            },

            // 打开添加章节弹框
            openChapterDialog() {

                // 弹出弹框
                this.dialogChapterFormVisible = true;

                // 情况表单数据
                this.chapter = {};
            },

            // 添加章节的方法
            addChapter() {

                // 设置课程id到chapter对象中
                this.chapter.courseId = this.courseId;
                chapter.addChapter(this.chapter)
                    .then(response =>{

                        // 关闭弹框
                        this.dialogChapterFormVisible = false;    // 初始化模态框是否可见 （添加章节的弹框）

                        // 提示信息,弹出一个提示框
                        this.$message({
                            type: 'success',
                            message: '添加章节信息成功!'
                        });

                        // 刷新页面
                        this.getChapterAndVideo();
                    })
            },

            // 根据id回显章节数据，并做修改
            editChapter(chapterId) {

                // 打开弹框
                this.dialogChapterFormVisible = true;    // 初始化模态框是否可见 （添加章节的弹框）

                chapter.getChapterInfo(chapterId)
                    .then(response => {

                        this.chapter = response.data.chapter;
                    })
            },

            // 修改章节的方法
            updateChapter() {

                chapter.updateChapter(this.chapter)
                    .then(response => {

                        // 关闭弹框
                        this.dialogChapterFormVisible = false;    // 初始化模态框是否可见 （添加章节的弹框）

                        // 提示信息,弹出一个提示框
                        this.$message({
                            type: 'success',
                            message: '修改章节信息成功!'
                        });

                        // 刷新页面
                        this.getChapterAndVideo();
                    })
            },

            // 删除章节的方法
            removeChapter(chapterId) {

                this.$confirm('此操作将永久删除该章节信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {   // 点击了确认删除按钮

                    chapter.deleteChapter(chapterId)
                        .then(response =>{  // 删除成功

                            // 提示信息,弹出一个提示框
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });

                            // 刷新页面
                            this.getChapterAndVideo();

                        })
                        .catch(error =>{  // 删除失败   注意：框架已经是自己封装了catch，所以以后可以不用自己再定义catch，避免发生同时执行两个catch

                            alert("删除失败："+error);
                        })

                }).catch(() => {  // 点击了取消删除按钮
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            /*========================================【章节操作】 -- 结束 =====================================*/

            /*========================================【小节操作】 -- start =====================================*/

            // 添加小节
            addVideo(chapterId) {

                // 弹出弹框
                this.dialogVideoFormVisible = true;
            }



            /*========================================【小节操作】 --  end  =====================================*/

        }
    }
</script>

<style scoped>

    .chanpterList{
        position: relative;
        list-style: none;
        margin: 0;
        padding: 0;
    }
    .chanpterList li{
        position: relative;
    }
    .chanpterList p{
        /*float: left;*/
        font-size: 20px;
        margin: 10px 0;
        padding: 10px;
        height: 70px;
        line-height: 50px;
        width: 100%;
        border: 1px solid #DDD;
    }
    .chanpterList .acts {
        float: right;
        font-size: 14px;
    }

    .videoList{
        padding-left: 50px;
    }
    .videoList p{
        float: left;
        font-size: 14px;
        margin: 10px 0;
        padding: 10px;
        height: 50px;
        line-height: 30px;
        width: 100%;
        border: 1px dotted #DDD;
    }
</style>
