import {ModelJS} from "../ModelJS.js";

/*
* Модель товаров каталога
* */
export class ProductsComposition extends ModelJS {
    static _structure = {
        productID: this.INT,
        productName: this.STRING,
        isDel: this.INT,
    };

    constructor(object) {
        super();
        ProductsComposition._fillObject(this, object);
    }

    /**
     * Обновление полей в указанном наборе товаров
     * @param {ProductsComposition} target в каком наборе товаров обновлять
     * @param {object} data данные для актуализации. Структура подобная _structure данного класса
     * @private
     */
    static _fillObject(target,data){
        for (let i in data){
            if(ProductsComposition._structure[i] !== undefined)
            {
                target[i] = target._validate(data[i], ProductsComposition._structure[i]);
            }
        }
    }

    //region getters

    /**
     * productID текущего товара
     * @return {number}
     * @constructor
     */
    get ID(){
        return this.productID;
    }

    /**
     * productName текущего товара
     * @return {string}
     * @constructor
     */
    get Name(){
        return this.productName;
    }

  
    /**
     * isDel - статус  текущего товара удалённый/неудалённый (1/0)
     * @return {int}
     * @constructor
     */
    get deleted(){
        return this.isDel;
    }

    //endregions

    //region setters

    /**
     * productID текущего товара
     * @param {ProductsComposition.ID} value
     * @constructor
     */
    set ID(value){
        this.categoryID = value;
    }

    /**
     * productName текущего товара
     * @param {ProductsComposition.Name} value
     * @constructor
     */
    set Name(value){
        this.categoryName = value;
    }

    /**
     * isDel - статус текущего товара удалённый/неудалённый (1/0)
     * @param {ProductsComposition.isDel} value
     */
    set deleted(value){
        this.isDel = value;
    }

    //endregion
}