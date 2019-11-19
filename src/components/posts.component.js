import { Component } from "../core/component"
import { apiService }  from '../services/api.service'
import { TransformService } from '../services/transform.service'
import { renderPost } from '../templates/post.template'


export class PostsComponent extends Component {
    constructor(id, {loader}){
        super(id)

        this.loader = loader
    }

    init(){
    this.$el.addEventListener('click', buttonHandler.bind(this))
    }

   async onShow() {
       this.loader.show()
       const fbData = await apiService.fetchPost()
       const posts = TransformService.fbObjectToArray(fbData)
       const html = posts.map(post => renderPost(post, {widthButton: true}))
       this.loader.hide()
       this.$el.insertAdjacentHTML('afterbegin', html.join(' '))
    }

    onHide(){
        this.$el.innerHTML = ''
    }

}

async function buttonHandler(event) {
    const $el = event.target

    const id = $el.dataset.id
    const title = $el.dataset.title

    if(id){
        let favorites = JSON.parse(localStorage.getItem('favorites')) || []
        if($el.classList.contains('button-remove')){
            await apiService.fetchRemoveById(id)
            favorites = favorites.filter(p=> p.id !== id)
            this.$el.querySelector(`[data-postid="${id}"]`).remove()
        }else{
            const condidate = favorites.find(p => p.id === id)
            if(condidate){
                // удалить елемент
                $el.textContent = 'Сохранить в избранное'
                $el.classList.add('button-primary')
                $el.classList.remove('button-danger')
                favorites = favorites.filter(p=> p.id !== id)
            }else{
                // добавить 
                $el.textContent = 'Удалить из избранного'
                $el.classList.remove('button-primary')
                $el.classList.add('button-danger')
                favorites.push({id, title})
            }
        }
        localStorage.setItem('favorites', JSON.stringify(favorites))
    }
}