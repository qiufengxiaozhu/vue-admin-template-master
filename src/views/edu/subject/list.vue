<template>
    <div class="app-container">

        <!--检索功能-->
        <el-input v-model="filterText" placeholder="Filter keyword" style="margin-bottom:30px;" />

        <!--树 组件-->
        <el-tree
            ref="tree2"
            :data="data2"
            show-checkbox
            :props="defaultProps"
            :filter-node-method="filterNode"
            class="filter-tree"
            default-expand-all
        />

    </div>
</template>

<script>

    import subject from '@/api/edu/subject';

    export default {

        data() {
            return {
                filterText: '',
                data2: [],  //返回所有分类数据
                defaultProps: {
                    children: 'children',   //实体类中的 children
                    label: 'title'          //实体类中的 title
                },
            }
        },
        created() {

            this.getAllSubjectList()
        },
        watch: {

            filterText(val) {
                this.$refs.tree2.filter(val)
            }
        },
        methods: {

            getAllSubjectList() {

                subject.getSubjectList()
                    .then(response => {

                        this.data2 = response.data.list;
                    })
            },
            filterNode(value, data) {

                if (!value) return true

                return data.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
            }
        }
    }
</script>
