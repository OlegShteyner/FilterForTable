export class MainTableView {


    /**
     * подключение методов к элементам формы
     * @param chooseCategoryClb событие на изменение выбора категорий
     */
    initInterface(chooseCategoryClb=null){
        let sel = document.getElementById('categoryChoose'), selOpt = sel.options;
        sel.addEventListener('change', e=>{
            let opts = [];
            let selOpt = document.getElementById('categoryChoose').options;

            for (let i = 0; i < selOpt.length; i++) {
                if (selOpt[i].selected)
                    opts.push({"ID": parseInt(selOpt[i].value)});
            }

            chooseCategoryClb(opts);
        });
        if(selOpt.length == 0) {
            sel.addEventListener('click', e => {
                if(selOpt.length == 0) {
                    sel.append(new Option('...', 0));
                    sel.options[0].selected = true;
                    sel.options[0].disabled = true;
                    chooseCategoryClb([]);
                }
            });
        }
    }

    /**
     * заполнение списка категорий для фильтрации
     * @param {<Array<SubCategoryComposition>>} catList список категорий
     */
    selectCategoriesFill(catList){
        if(!catList)
            return;
        const categoriesChooseSelect = document.getElementById('categoryChoose');
        const categoriesOptions = catList.reduce( (accumulator, current) => [ ...accumulator, new Option(current.Name, current.ID)], []);
        categoriesChooseSelect.append(...categoriesOptions);
    }

    /**
     * Отрисовка данных в таблице основного окна
     * @param {<Array<CatalogComposition>>} categoriesData - отображаемые данные
     */
    renderMainTable(categoriesData){
        MainTableView.clearChild(document.getElementById('mainTableBody'));
        let fragment = document.createDocumentFragment();
        for (let ii in categoriesData){
            let row = this.renderTableRow(categoriesData[ii]);
            if(row !== null)
                fragment.appendChild(row);
        }
        this._toAppendElement('mainTableBody',fragment);
    }

    /**
     * Отрисовка строки таблицы категорий основного окна
     * @param {CatigoriesComposition} rowData - строка данных по категориям
     * @return {DocumentFragment}
     */
    renderTableRow(rowData){
        let tpl = document.getElementById('mainTableRowTempl').content.cloneNode(true);

        tpl.querySelector('#categoryRow').id += `_${rowData.ID}`;
        tpl.querySelector('#viewSubCategory').id += `_${rowData.ID}`;
        tpl.querySelector('#categoryName').id += `_${rowData.ID}`;
        tpl.querySelector('#subCategories').id += `_${rowData.ID}`;
        tpl.querySelector('#subCategoriesBody').id += `_${rowData.ID}`;
        tpl.querySelector('[id^=categoryName]').innerText = rowData.Name;

        //реакция на разворот дерева подкатегорий
        tpl.getElementById('viewSubCategory_' + rowData.ID).addEventListener('click', e => {
            if(e.target.getAttribute('isOpened') == 1){
                e.target.setAttribute('isOpened',0);
                e.target.src = e.target.getAttribute('openSrc');
                MainTableView.clearChild(`subCategoriesBody_${rowData.ID}`);
                document.getElementById(`subCategories_${rowData.ID}`).style.display = 'none';
                document.getElementById(`subCategoriesBody_${rowData.ID}`).style.display = 'none';
            }
            else{
                e.target.src = e.target.getAttribute('closeSrc');
                e.target.setAttribute('isOpened',1);
                document.getElementById(`subCategories_${rowData.ID}`).style.display = 'table-row';
                document.getElementById(`subCategoriesBody_${rowData.ID}`).style.display = 'table-row';
                rowData.getSubCategories()
                    .then(subCategoriesList=>{
                        if (subCategoriesList.length)
                            this._toAppendElement(`subCategoriesBody_${rowData.ID}`, this.renderSubCategoriesList(subCategoriesList));
                        else{
                            MainTableView.clearChild(`subCategoriesBody_${rowData.ID}`);
                            console.error(new Error('У категории ожидаются подкатегории, а их нет'));
                        }
                    })
                    .catch(e=>{
                        MainTableView.clearChild(`subCategoriesBody_${rowData.ID}`);
                        throw e;
                    });

            }
        });

        return tpl;

    }

    /**
     * Отрисовка подкатегорий категории
     * @param {Array<SubCategoryComposition>} subCategoriesList
     * @return {DocumentFragment}
     */
    renderSubCategoriesList(subCategoriesList){
        let subCategoriesContainer = document.createDocumentFragment();
        for (let ii in subCategoriesList){
            let row = this.renderSubCategoriesRow(subCategoriesList[ii]);
            if(row !== null)
                subCategoriesContainer.appendChild(row);
        }

        return subCategoriesContainer;
    }

    /**
     * Отрисовка строки подкатегорий
     * @param {SubCategoryComposition} subCategory подкатегория
     * @return {DocumentFragment}
     */
    renderSubCategoriesRow(subCategory){
        let tpl = document.getElementById('subCategirysRowTempl').content.cloneNode(true);

        tpl.querySelector('#subCategoriesRow').id += `_${subCategory.ID}`;
        tpl.querySelector('#viewProducts').id += `_${subCategory.ID}`;
        tpl.querySelector('#subCategoryName').id += `_${subCategory.ID}`;
        tpl.querySelector('#products').id += `_${subCategory.ID}`;
        tpl.querySelector('#productsBody').id += `_${subCategory.ID}`;
        tpl.querySelector('[id^=subCategoryName]').innerText = subCategory.Name;

        //реакция на разворот дерева товаров
        tpl.getElementById(`viewProducts_${subCategory.ID}`).addEventListener('click', e => {
            if(e.target.getAttribute('isOpened') == 1){
                e.target.setAttribute('isOpened',0);
                e.target.src = e.target.getAttribute('openSrc');
                MainTableView.clearChild(`productsBody_${subCategory.ID}`);
                document.getElementById(`productsBody_${subCategory.ID}`).style.display = 'none';
                document.getElementById(`products_${subCategory.ID}`).style.display = 'none';
            }
            else{
                e.target.src = e.target.getAttribute('closeSrc');
                e.target.setAttribute('isOpened',1);
                document.getElementById(`products_${subCategory.ID}`).style.display = 'table-row';
                document.getElementById(`productsBody_${subCategory.ID}`).style.display = 'table-row';

                subCategory.getProducts()
                    .then(productsList=>{
                        if (productsList.length)
                            this._toAppendElement(`productsBody_${subCategory.ID}`, this.renderProductsList(productsList));
                        else{
                            MainTableView.clearChild(`productsBody_${subCategory.ID}`);
                            console.error(new Error('У подкатегории ожидаются товары, а их нет'));
                        }
                    })
                    .catch(e=>{
                        MainTableView.clearChild(`productsBody_${subCategory.ID}`);
                        throw e;
                    });
            }
        });

        return tpl;
    }

    /**
     * Отрисовка товаров подкатегории
     * @param {Array<ProductsComposition>} productsList
     * @return {DocumentFragment}
     */
    renderProductsList(productsList){
        let productsContainer = document.createDocumentFragment();
        for (let ii in productsList){
            let row = this.renderProductRow(productsList[ii]);
            if(row !== null)
                productsContainer.appendChild(row);
        }

        return productsContainer;
    }

    /**
     * Отрисовка строки товаров
     * @param {ProductsComposition} subCategory подкатегория
     * @return {DocumentFragment}
     */
    renderProductRow(product){
        let tpl = document.getElementById('productsRowTempl').content.cloneNode(true);
        tpl.querySelector('#product').id += `_${product.ID}`;
        tpl.querySelector('#productName').id += `_${product.ID}`;
        tpl.querySelector('[id^=productName]').innerText = product.Name;

        return tpl;
    }

    /**
     *  Приаппендивает данные data в элемент target, а если данных нет, то рисует там шестерёнку
     * @param {string} target - объект в котором появится гайка загрузки или данные
     * @param {DocumentFragment} data - загружемые данные
     * @private
     */
    _toAppendElement(target, data = null){
        MainTableView.clearChild(target);
        document.getElementById(target).appendChild(data==null?document.getElementById('loaderIcon').content.cloneNode(true):data);
        if(document.getElementById(target).style.display == "none")
            document.getElementById(target).style.display = "inline-block";
    }

    /**
     * "чистка" указанного элемента от всех child
     * @param {HTMLElement|string} element
     * @return {boolean}
     */
    static clearChild(element){
        let el;
        if(typeof element === "object")
            el = element;
        else if(document.getElementById(element))
            el = document.getElementById(element);
        else
            return false;

        if(el !== null) {
            while (el.firstChild) {
                el.removeChild(el.lastChild);
            }
        }
        return true;
    }

}