# Necklace algorithm sync test 

### Окружение
* 1 x 3.3 CPU 
* 2 Gb RAM 
* 30 RG NVMe

### Описание задачи
Решение игры "Ожерелье" перебором. Тест проходит по следующим переменным: grid-len{1..9}, batchSize{1..1000}. Тестирование проводится с целью определения оптимального размера решений, передаваемых в подзадачу, для различного размера графа.  
```js
for (let gl = 1; gl <= 9; gl++) {
  let an: { size: number; time: number }[] = [];

  for (let i = 1; i <= 1000; i++) {
    const res = app.run(i, gl);
    an.push({size: i, time: res});
  }

  an.sort((a, b) => a.size - b.size);
  fs.writeFileSync(__dirname + `/../data/gl-${gl}.txt`, an.map(item => `{ size: ${item.size}, time: ${item.time} }`).join('\n'));
  an = [];
}
```

### Результаты
* [Результат графа с размером 1](./data/text/gl-1.txt)
* [Результат графа с размером 2](./data/text/gl-2.txt)
* [Результат графа с размером 3](./data/text/gl-3.txt)
* [Результат графа с размером 4](./data/text/gl-4.txt)
* [Результат графа с размером 5](./data/text/gl-5.txt)
* [Результат графа с размером 6](./data/text/gl-6.txt)
* [Результат графа с размером 7](./data/text/gl-7.txt)
* [Результат графа с размером 8](./data/text/gl-8.txt)
* [Результат графа с размером 9](./data/text/gl-9.txt)

![Результат графа с размером 1](./data/graph/graph_1.png)
![Результат графа с размером 2](./data/graph/graph_2.png)
![Результат графа с размером 3](./data/graph/graph_3.png)
![Результат графа с размером 4](./data/graph/graph_4.png)
![Результат графа с размером 5](./data/graph/graph_5.png)
![Результат графа с размером 6](./data/graph/graph_6.png)
![Результат графа с размером 7](./data/graph/graph_7.png)
![Результат графа с размером 8](./data/graph/graph_8.png)
![Результат графа с размером 9](./data/graph/graph_9.png)
