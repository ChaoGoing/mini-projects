class Sort {
    constructor() {
        this.compare = null;
        this.pipeline = [];
    }

    map(_value) {
        this.pipeline.push({
            value: _value,
            type: "map",
        });
    }

    plugin(_value) {
        this.pipeline.push({
            value: _value,
            type: "plugin",
        });

    }

    sortBy(fn) {
        this.compare = fn;
    }

    seal() {
        function defaultFn() {
            return a === b ? 0 : a < b ? -1 : 1;
        }
        const compareFn = this.compare || defaultFn(a, b);
        // plugin其实就是从右往左的compose函数，先对当前的a,b进行sortFn比较, 然后使用plugin对结果进行定制化修改，例如，倒序插件就是对结果进行 取反
        const plugin =
            (plug) =>
                (sortFn) =>
                    (...args) =>
                        plug(sortFn(...args));
        
        // mapping 的话蕾丝compse从左往右进行，但不同的是对所有的单独的arg执行map函数，具体到排序中就是对传入的每个a,b进行值的处理，然后再进行排序操作
        const mapping =
            (map) =>
                (sortFn) =>
                    (...args) =>
                        sortFn(...args.map((x) => map(x)));
        const pass = sortFn => (...args) => sortFn(...args)

        // pass函数只是作为空函数的起点，mapping和plguin都只是执行了一次，因为接下来要接收的参数是sortFn, 
        // 而sortFn的定义要等到this.compare的传入，这里很有组合的味道，pass 和 compose 起到的
        // 作用类似于 curry 
        return this.pipeline.reduce((lastSortFn, current) => {
            const { _type, _value } = current;
            if (_type === "map") return mapping(lastSortFn(_value));
            if (_type === "plugin") return plugin(_value)(lastSortFn);
        }, pass)(this.compare);
    }
}

const sort = new Sort();
