/* 由于element是按需导入的，所以必须按照es6模块规范导入要用到的element组件,并且使用Vue.use把它们注册为vue的全局组件 */
import Vue from 'vue'
import { Button,
  Form,
  FormItem,
  Input,
  Message,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  Submenu,
  MenuItemGroup,
  MenuItem,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Select,
  Option,
  Row,
  Col,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination,
  Dialog,
  MessageBox,
  Tag,
  Tree


 } from 'element-ui'
/* 注册作为vue的全局组件,使所有vue组件中均可使用 */
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Select)
Vue.use(Option)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)

/*
  对于组件使用Vue.use()进行挂载，则Vue可以识别和渲染该组件。
  对于方法使用Vue.prototype.$xxxxx 进行引用，则在所有vue组件中可以通过this.$xxxxx 进行调用。
*/

Vue.prototype.$message=Message //使每个vue组件可以通过this.$message进行调用，下面同理
Vue.prototype.$confirm=MessageBox.confirm
