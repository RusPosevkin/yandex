# JS-фреймворк для работы с css классами dom элементов

# [Демо](http://posevkin.ru/yandex/framework/demo/demo.html "JS-framework")
## Поиск элементов
$fw осуществляет поиск элементов с использованием css-селекторов:
```
$fw("#idName");
$fw(".className");
$fw("div");
```

#### $fw.each(callback)
Перебирает все найденные элементы и для каждого из них выполняет принимаемую в качестве параметра функцию.

#### $fw._classManipulation(action, self, name, condition))
Вспомогательная внутренняя функция для работы со списком класса элемента.
`action` — тип операции, осуществляемой со списком классов; `self` - контекст; `name` — имя класса или массив имен классов; `condition` — условие булевого типа для операции `toggle` со списком классов.

#### $fw.getClassList()
Метод, возвращающий список всех классов для найденных элементов.

#### $fw.addClass(name)
Метод принимает в качестве параметра имя класса или массив имен классов. С помощью `$fw._classManipulation` добавляет класс(ы) для найденных элементов.

#### $fw.removeClass(name)
Метод принимает в качестве параметра имя класса или массив имен классов. С помощью `$fw._classManipulation` удаляет перечисленные классы для найденных элементов.
Если происходит вызов метода без передачи параметров — удаляет все имеющиеся классы для найденных элементов.

#### $fw.toggleClass(name, condition)
Метод принимает в качестве параметра имя класса или массив имен классов. Удаляет или добавляет с помощью `$fw._classManipulation` один или несколько классов для найденных элементов в зависимости от наличия этого класса.

Если при вызове метода также передается необязательный параметр `condition`, то метод Удаляет или добавляет  один или несколько классов для найденных элементов в зависимости от значения булевого типа `condition`.

#### $fw.hasClass(name)
Метод принимает в качестве параметра имя класса. Метод возвращает `true/false` в зависимости от того существует ли указанный класс у найденных элементов.

#### $fw.html(content)
Если метод вызывается с параметром, то во все найденные элементы вставляется HTML-разметка из `content`. При этом метод возвращает вставленную HTML-разметку.

Если вызов производится без параметра, метод возвращает HTML-разметку из первого найденного элемента.

#### $fw.text(value)
Если метод вызывается с параметром, то во все найденные элементы вставляется текст из `value`. При этом метод возвращает вставленный текст.

Если вызов производится без параметра, метод возвращает сконкатенированный текст из всех найденных элементов.