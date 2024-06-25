import sfInput from './sf-input'
import sfModelBox from './sf-modelBox'
import sfCollapseTransition from './sf-collapse-transition'
import sfPagination from './sf-pagination'
import sfMessageBox from './sf-messageBox'
import sfPileStation from './sf-pileStation'
import sfTooltip from './sf-toolTip'

const lists = [sfInput, sfModelBox, sfCollapseTransition, sfPagination, sfMessageBox, sfPileStation, sfTooltip]

const components = {
  install(Vue) {
    lists.forEach(item => {
      Vue.component(item.name, item)
    })
  }
}

export default components
