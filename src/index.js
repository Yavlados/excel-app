import {Toolbar} from '@/components/toolbar/Toolbar'
import {Formula} from '@/components/formula/Formula'
import {Header} from '@/components/header/Header'
import {Excel} from '@/components/excel/Excel'
import {Table} from '@/components/table/Table'
import '@styles/index.scss'

const excel = new Excel('#app', {
    components: [Header, Toolbar, Formula, Table]
})
excel.render()