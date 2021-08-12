
export class ModelJS {

    static INT = 1;
    static FLOAT = 2;
    static STRING = 3;
    static BOOL = 4;
    static OBJECT = 5;
    static DATE = 6;
    static NUMERICARRAY = 7;
    static UNCHECKED = 99;

    /**
     * функция приведения типов при инициализации полей
     * @param value
     * @param type
     * @return {number | boolean | Date}
     */
    _validate(value,type){
        switch (type) {
            case 1 :
                value = parseInt(value);
                if(isNaN(value)){
                    value = null;
                }
                break;
            case 2 :
                value = parseFloat(value);
                if(isNaN(value)){
                    value = null;
                }
                break;
            case 3:
                if(null === value || value.toLowerCase().trim() === 'null')
                    value = null;
                else
                    value +='';
                break;
            case 4:
                value = !!value;
                break;

            case 5:
                if(typeof(value) !== 'object'){
                    value =null;
                }
                break;
            case 6:
                value = new Date(value);
                break;
            case 7:
                let _ = [];
                for(let num in value){
                    _[parseInt(num)] = value[num];
                }
                value = _;
                break;
        }

        return value;
    }

    /**
     * запрос к серверу. по сути оболочка над fetch
     * @param url
     * @param options
     * @return {Promise<Response>}
     */
    static fetch(url,options= null){
        return fetch(url,options);
    }

    /**
     * ф-я фильтрации
     * @param {array<ModelJS>} list
     * @param {Function} clb
     * @return {array<ModelJS>|[]}
     */
    static filter(list,clb) {
        if (!clb || !list) {
            console.info('->list is empty');
            return [];
        }

        return list.filter((element, number) => {
            return clb(element, number);
        });
    }

}