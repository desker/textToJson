# textToJson

Начать работу с написания тестов.

###Общие замечания.
1. Bower.
2. Используем UMD (Universal Module Definition)
3. Тесты на jasmine


##ТЗ

Входящие данные: текст с разметкой (смайлы, цитаты, хэштеги, bold, hr, упоменания).

Результат: json, будет использоваться для вывода текста в UI.

##Описание алгоритма

###Шаг 1. Разбиваем текст на строки.

Алгоритм можно реализовать в виде построчного прохода текста.
Разеделитель строк: перенос строки.

*Входящие данные*

```
Lorem Ipsum is simply dummy text of the printing and typesetting industry. \n
It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.\n
There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.\n
```
*Результат*
``` json
 [
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. \n
It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout." , 
    "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable."
 ]
```

####Если встречаются подряд 2 и более переноса строки без текста, то они объединяются в тег br

*Входящие данные*
```
Lorem Ipsum is simply dummy text of the printing.\n
\n
\n
\n
Lorem Ipsum is simply dummy text of the printing.
\n
\n
```
*Результат*
``` json
 [
    "Lorem Ipsum is simply dummy text of the printing.",
    {"tag":"br"},
    "Lorem Ipsum is simply dummy text of the printing." , 
    {"tag":"br"}
 ]
``` 
#### Если строка равна ...   ,то она заменяется тегом hr
 
 *Входящие данные*
 ```
Lorem Ipsum is simply dummy text of the printing.\n
...
Lorem Ipsum is simply dummy text of the printing.\n
 ```
 *Результат*
 ``` json
 [
    "Lorem Ipsum is simply dummy text of the printing.",
    {"tag":"hr"},
    "Lorem Ipsum is simply dummy text of the printing."
 ]
``` 

#### Цитаты обозначаются знаком ">" в начале строки. Строки с ">" идущие друг за другом объединяются в одну цитату. 
 *Входящие данные*
 ```
>Lorem Ipsum is simply dummy text of the printing.\n
>Lorem Ipsum is simply dummy text of the printing.\n
There are many variations of passages of Lorem Ipsum available.\n
>Lorem Ipsum is simply dummy text of the printing.\n
 ```
 *Результат*
 ``` json
 [
    
    {
    "tag":"blockquote", 
    "value":[
      "Lorem Ipsum is simply dummy text of the printing.",
      "Lorem Ipsum is simply dummy text of the printing."
    ]},
    "There are many variations of passages of Lorem Ipsum available.",
    {
    "tag":"blockquote", 
    "value":[
      "Lorem Ipsum is simply dummy text of the printing."
    ]},
   
 ]
``` 


###Шаг 2. Парсим строки.

Каждую строку (включая строки в цитатах) проверяем на наличие следующей разметки.
Если встречается, то строка разбивается на массив.

####  \*Курсив\* и \*\*жирный\*\*

 *Входящие данные*
 ```
>Lorem *Ipsum is simply* dummy text of the printing.\n
>Lorem **Ipsum is simply** dummy text of the printing.\n
 ```
 *Результат*
 ``` json
 [
    
    {
    "tag":"blockquote", 
    "value":[
      ["Lorem ", {"tag":"i", "value": "Ipsum is simply"}, "dummy text of the printing."],
      ["Lorem ", {"tag":"b", "value": "Ipsum is simply"}, "dummy text of the printing."],
    ]}
 ]
``` 
В тестах обязательно добавить тесты, когда в одной строке встречается несколько разметок.


####  Все, что идет после # будет хештегом.

В хэштеги можно включать буквы, цифры и шифт минус или нижнее подчеркивание.

 *Входящие данные*
 ```
>Lorem #Ipsum, #Photo.\n
 ```
 *Результат*
 ``` json
 [
    ["Lorem", {"tag":"hash", "value": "Ipsum"} , {"tag":"hash", "value": "Photo"} , "." ]
 ]
``` 

####  Упоминания имеют следующий формат @id1234(Сергей Иванов) или @idg1234(Наименование группы)


 *Входящие данные*
 ```
>Lorem @id1234(Сергей Иванов), @idg1234(Наименование группы).\n
 ```
 *Результат*
 ``` json
 [
    ["Lorem", {"tag":"mention", "value": "Сергей Иванов", id:"1234"} , 
    {"tag":"mention", "value": "Наименование группы", "id":"1234", "isGroup": true} , "." ]
 ]
``` 


