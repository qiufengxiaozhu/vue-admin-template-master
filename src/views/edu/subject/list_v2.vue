<template>
    <div class="app-container">

        <!--树状列表开始-->
        <div class="custom-tree-container">

            <div class="block">
                <p>使用 render-content</p>
                <el-tree
                    :data="data"
                    show-checkbox
                    highlight-current
                    default-expand-all
                    :props="defaultProps"
                    :expand-on-click-node="false"
                    :render-content="renderContent">
                </el-tree>
            </div>

        </div>
        <!--树状列表结束-->

    </div>
</template>

<script>

    import subject from '@/api/edu/subject';

    let id = 1000;

    export default {
        data() {
            const data = [];
            return {

                // data: JSON.parse(JSON.stringify(data)),
                data: [],
                defaultProps: {
                    children: 'children',   //实体类中的 children
                    label: 'title'          //实体类中的 title
                }
            }
        },
        created() {

            this.getAllSubjectList()
        },
        watch: {


        },
        methods: {
            getAllSubjectList() {

                subject.getSubjectList()
                    .then(response => {

                        this.data = response.data.list;
                    })
            },
            append(data) {
                const newChild = { id: id++, label: 'title', children: [] };
                if (!data.children) {
                    this.$set(data, 'children', []);
                }
                data.children.push(newChild);
            },

            remove(node, data) {
                const parent = node.parent;
                const children = parent.data.children || parent.data;
                const index = children.findIndex(d => d.id === data.id);
                children.splice(index, 1);
            },
            renderContent(h, { node, data, store }) {

                return (
                    <span class="custom-tree-node">
                        <span>{node.label}</span>
                        <span>
                            <el-button size="mini" type="text" on-click={ () => this.append(data) }>添加</el-button>
                            <el-button size="mini" type="text" on-click={ () => this.remove(node, data) }>删除</el-button>
                        </span>
                    </span>
                );
            }

        }
    };
</script>

<style>
    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }
</style>
