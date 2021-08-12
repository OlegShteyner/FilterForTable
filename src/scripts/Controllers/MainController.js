import {CatalogComposition} from "../Models/CatalogComposition.js";
import {MainTableView} from "../Views/MainTableView.js";

/**
 * Главный контроллер модуля
 */
export class MainController {
    constructor() {
        this._catalogData = null;
        this._view = new MainTableView();
    }

    /**
     * Инициализация интерфейса
     */
    initInterface() {
        this._view.initInterface(
            cats => {
              if(cats.length>0){
                this.showSelectCategories(cats);
              }
              else{
                this._catalogData = this.getData(cats);
              }
            }
        );
        return this;
    }

    /**
     * Получение данных
     * @param {array} selectedCats - массив отобранных категорий
     * @return {Promise<HTMLElement>}
     */
    getData(selectedCats) {
        return CatalogComposition.getModels()
            .then(result => {
                this._catalogData = result;
                if(selectedCats.length > 0) {
                    this.showSelectCategories(selectedCats); // отрисовка
                }
                else {
                    this._view.selectCategoriesFill(result); // заполнение фильтра категорий
                }
            });
    }

    /**
     * Отрисовка данных в таблице главного окна
     * @param {array} selectedArr - массив отобранных категорий
     */
    showSelectCategories(selectedArr){
        this._view.renderMainTable(this._catalogData.filter(a => selectedArr.some(t => t.ID == a.ID)));
    }

}