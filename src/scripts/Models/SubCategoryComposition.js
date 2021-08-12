import {ModelJS} from "../ModelJS.js";
import {ProductsComposition} from "./ProductsComposition.js";

/*
* Модель подкатегорий каталога
* */
export class SubCategoryComposition extends ModelJS {
    static _structure = {
        categoryID: this.INT,
        categoryName: this.STRING,
        isDel: this.INT,
        products: this.UNCHECKED,
    };

    constructor(object) {
        super();
        this.products = [];
        SubCategoryComposition._fillObject(this, object);
    }

    /**
     * Обновление полей в подкатегории
     * @param {SubCategoryComposition} target в какой подкатегории обновлять
     * @param {object} data данные для актуализации. Структура подобная _structure данного класса
     * @private
     */
    static _fillObject(target,data){
        for (let i in data){
            if(SubCategoryComposition._structure[i] !== undefined)
            {
                if (i == "products"){
                    for (let d in data['products']) {
                        target.pushProducts(new ProductsComposition(data['products'][d]));
                    }
                }
                else {
                    target[i] = target._validate(data[i], SubCategoryComposition._structure[i]);
                }
            }
        }
    }

    /**
     * Добавляет еще один товар к списку
     * @param {ProductsComposition} product
     */
    pushProducts(product) {
        this.products.push(product);
    }

    /**
     * Получить список товаров по текущей подкатегории
     * @return {Promise<Array<ProductsComposition>>}
     */
    getProducts() {
        if (this.products.length > 0)
            return Promise.resolve(this.products);
    }
    
    //region getters

    /**
     * categoryID текущей подкатегории
     * @return {number}
     * @constructor
     */
    get ID(){
        return this.categoryID;
    }

    /**
     * categoryName текущей подкатегории
     * @return {string}
     * @constructor
     */
    get Name(){
        return this.categoryName;
    }

  
     /**
     * productsList - список товаров
     * @return {array}
     * @constructor
     */
    get productsList(){
        return this.products;
    }


    /**
     * isDel - статус текущей категории удалённый/неудалённый (1/0)
     * @return {int}
     * @constructor
     */
    get deleted(){
        return this.isDel;
    }

    //endregions

    //region setters

    /**
     * categoryID текущей подкатегории
     * @param {SubCategoryComposition.ID} value
     * @constructor
     */
    set ID(value){
        this.categoryID = value;
    }

    /**
     * categoryName текущей подкатегории
     * @param {SubCategoryComposition.Name} value
     * @constructor
     */
    set Name(value){
        this.categoryName = value;
    }

    /**
     * isDel - статус текущей подкатегории удалённый/неудалённый (1/0)
     * @param {SubCategoryComposition.isDel} value
     */
    set deleted(value){
        this.isDel = value;
    }

    //endregion
}