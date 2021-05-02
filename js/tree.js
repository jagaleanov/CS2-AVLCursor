const ID = 0;
const VALUE = 1;
const LEFT = 2;
const RIGHT = 3;
const BALANCE = 4;

class ListNode {
    data;
    next;

    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

class Stack {

    head;

    constructor() {
        this.head = null;
    }

    push(data) {

        if (this.head != null) {
            var newNode = new ListNode(data);
            newNode.next = this.head;
            this.head = newNode;
        } else {
            var newNode = new ListNode(data);
            this.head = newNode;
        }
    }

    pop() {

        var removed = this.head;
        var next = this.head.next;

        this.head = next;
        return removed.data;
    }

    isEmpty() {
        return this.head == null;
    }
}

class Queue {

    head;

    constructor() {
        this.head = null;
    }

    enqueue(data) {
        var newNode = new ListNode(data);

        if (this.head == null) {
            this.head = newNode;
        } else {
            let nodeParent = this.findTail();
            nodeParent.next = newNode;
        }
    }

    findTail() {
        let pivot = this.head;
        while (pivot.next != null) {
            pivot = pivot.next;
        }
        return pivot;
    }

    dequeue() {

        var removed = this.head;
        var next = this.head.next;

        this.head = next;
        return removed.data;
    }

    isEmpty() {
        return this.head == null;
    }
}

class MatrixAVL {

    table;
    counter;

    constructor() {
        this.table = [];

        let newReg = [];
        this.counter = 0;

        newReg.push(this.counter);
        newReg.push('');//value
        newReg.push(0);//left
        newReg.push(0);//right
        newReg.push(0);//balance
        this.table.push(newReg);
        this.newNodes();
    }

    newNodes() {
        let newReg;
        let parentNode;
        for (let i = 0; i < 5; i++) {
            this.counter++;

            newReg = [];
            newReg.push(this.counter);
            newReg.push('');//value
            newReg.push(0);//left
            newReg.push(0);//right
            newReg.push(0);//balance

            parentNode = this.table[0];

            while (parentNode[RIGHT] != 0) {
                parentNode = this.table[parentNode[RIGHT]];
            }

            parentNode[RIGHT] = this.counter;

            this.table.push(newReg);
        }
    }

    rollLeft(rowParent) {
        let rowRight = this.table[rowParent[RIGHT]];
        this.table[rowParent[ID]][BALANCE] = 0;
        this.table[rowRight[ID]][BALANCE] = 0;
        this.table[rowParent[ID]][RIGHT] = this.table[rowRight[ID]][LEFT];
        this.table[rowRight[ID]][LEFT] = rowParent[ID];
        return this.table[rowRight[ID]];
    }

    rollRight(rowParent) {
        let rowLeft = this.table[rowParent[LEFT]];
        this.table[rowParent[ID]][BALANCE] = 0;
        this.table[rowLeft[ID]][BALANCE] = 0;
        this.table[rowParent[ID]][LEFT] = this.table[rowLeft[ID]][RIGHT];
        this.table[rowLeft[ID]][RIGHT] = rowParent[ID];
        return this.table[rowLeft[ID]];
    }

    doubleRollLeft(rowParent) {
        let rowRight = this.table[rowParent[RIGHT]];
        let rowRightLeft = this.table[rowRight[LEFT]];
        this.table[rowRight[ID]][LEFT] = this.table[rowRightLeft[ID]][RIGHT];
        this.table[rowRightLeft[ID]][RIGHT] = rowRight[ID];
        this.table[rowParent[ID]][RIGHT] = this.table[rowRightLeft[ID]][LEFT];
        this.table[rowRightLeft[ID]][LEFT] = rowParent[ID];

        switch (rowRightLeft[BALANCE]) {
            case -1:
                this.table[rowRight[ID]][BALANCE] = 0;
                this.table[rowParent[ID]][BALANCE] = 1;
                break;
            case 0:
                this.table[rowRight[ID]][BALANCE] = rowParent[BALANCE] = 0;
                break;
            case 1:
                this.table[rowRight[ID]][BALANCE] = -1;
                this.table[rowParent[ID]][BALANCE] = 0;
                break;
        }
        this.table[rowRightLeft[ID]][BALANCE] = 0;
        return this.table[rowRightLeft[ID]];
    }

    doubleRollRight(rowParent) {
        let rowLeft = this.table[rowParent[LEFT]];
        let rowLeftRight = this.table[rowLeft[RIGHT]];
        this.table[rowLeft[ID]][RIGHT] = this.table[rowLeftRight[ID]][LEFT];
        this.table[rowLeftRight[ID]][LEFT] = rowLeft[ID];
        this.table[rowParent[ID]][LEFT] = this.table[rowLeftRight[ID]][RIGHT];
        this.table[rowLeftRight[ID]][RIGHT] = rowParent[ID];

        switch (rowLeftRight[BALANCE]) {
            case -1:
                this.table[rowLeft[ID]][BALANCE] = 1;
                this.table[rowParent[ID]][BALANCE] = 0;
                break;
            case 0:
                this.table[rowLeft[ID]][BALANCE] = rowParent[BALANCE] = 0;
                break;
            case 1:
                this.table[rowLeft[ID]][BALANCE] = 0;
                this.table[rowParent[ID]][BALANCE] = -1;
                break;
        }
        this.table[rowLeftRight[ID]][BALANCE] = 0;
        return this.table[rowLeftRight[ID]];
    }

    insert(value) {
        let newNode;
        let rowPivot;
        let rowPivotParent;
        let rowSonToBalance;
        let rowToBalance;
        let rowParent;
        let height;
        let temp;

        rowParent = rowPivotParent = null;
        newNode = this.table[this.table[0][RIGHT]];
        newNode[VALUE] = value;

        temp = this.table[0][RIGHT];
        this.table[0][RIGHT] = newNode[RIGHT];
        newNode[RIGHT] = 0;

        if (this.table[0][RIGHT] == 0) {
            this.newNodes();
        }

        if (this.table[0][LEFT] == 0) {//si no exite nodo raiz
            this.table[0][LEFT] = temp;
            return (1);
        }

        newNode[LEFT] = 0;
        newNode[BALANCE] = 0;

        rowToBalance = rowPivot = this.table[this.table[0][LEFT]];//raiz
        while (rowPivot[ID] != 0) {
            if (rowPivot[BALANCE] != 0) {
                rowParent = rowPivotParent;
                rowToBalance = rowPivot;
            }

            if (value == rowPivot[VALUE]) {
                alert("El nombre ingresado ya se encuentra, por favor ingrese otro");
                return (2);
            } else {
                rowPivotParent = rowPivot;
                if (value < rowPivot[VALUE]) {
                    rowPivot = this.table[rowPivot[LEFT]];
                } else {
                    rowPivot = this.table[rowPivot[RIGHT]];
                }
            }
        }

        if (value < rowPivotParent[VALUE]) {
            rowPivotParent[LEFT] = newNode[ID];
        } else {
            rowPivotParent[RIGHT] = newNode[ID];
        }

        if (value < rowToBalance[VALUE]) {
            rowSonToBalance = this.table[rowToBalance[LEFT]];
            height = 1;
        } else {
            rowSonToBalance = this.table[rowToBalance[RIGHT]];
            height = -1;
        }

        rowPivot = rowSonToBalance;
        while (rowPivot[ID] != newNode[ID]) {
            if (value < rowPivot[VALUE]) {
                rowPivot[BALANCE] = 1;
                rowPivot = this.table[rowPivot[LEFT]];
            } else {
                rowPivot[BALANCE] = -1;
                rowPivot = this.table[rowPivot[RIGHT]];
            }
        }

        if (rowToBalance[BALANCE] == 0) {
            rowToBalance[BALANCE] = height;
        } else if (rowToBalance[BALANCE] + height == 0) {
            rowToBalance[BALANCE] = 0;
        } else {
            if (height == 1) {
                if (rowSonToBalance[BALANCE] == 1) {
                    rowSonToBalance = this.rollRight(rowToBalance);
                } else {
                    rowSonToBalance = this.doubleRollRight(rowToBalance);
                }
            } else {
                if (rowSonToBalance[BALANCE] == -1) {
                    rowSonToBalance = this.rollLeft(rowToBalance);
                } else {
                    rowSonToBalance = this.doubleRollLeft(rowToBalance);
                }
            }

            if (rowParent == null) {
                this.table[0][LEFT] = rowSonToBalance[ID];
            } else if (rowParent[LEFT] == rowToBalance[ID]) {
                rowParent[LEFT] = rowSonToBalance[ID];
            } else {
                rowParent[RIGHT] = rowSonToBalance[ID];
            }
        }

        return 1;
    }

    balanceRight(rowParent, finish) {
        let rowRight = null;
        let res = null;
        switch (rowParent[BALANCE]) {
            case 1:
                this.table[rowParent[ID]][BALANCE] = 0;
                res = this.table[rowParent[ID]];
                break;
            case -1:
                rowRight = this.table[rowParent[RIGHT]];
                switch (rowRight[BALANCE]) {
                    case 1:
                        rowRight = this.doubleRollLeft(rowParent);
                        break;
                    case -1:
                        rowRight = this.rollLeft(rowParent);
                        break;
                    case 0:
                        this.table[rowParent[ID]][RIGHT] = rowRight[LEFT];
                        this.table[rowRight[ID]][LEFT] = rowParent[ID];
                        this.table[rowRight[ID]][BALANCE] = 1;
                        finish[0] = 1;
                        break;
                }
                res = this.table[rowRight[ID]];
                break;
            case 0:
                this.table[rowParent[ID]][BALANCE] = -1;
                res = this.table[rowParent[ID]];
                finish[0] = 0.5;
                break;
        }

        return res;
    }

    balanceLeft(rowParent, finish) {
        let rowLeft = null;
        let res = null;
        switch (rowParent[BALANCE]) {
            case -1:
                this.table[rowParent[ID]][BALANCE] = 0;
                res = this.table[rowParent[ID]];
                break;
            case 1:
                rowLeft = this.table[rowParent[LEFT]];
                switch (rowLeft[BALANCE]) {
                    case 1:
                        rowLeft = this.rollRight(rowParent);
                        break;
                    case -1:
                        rowLeft = this.doubleRollRight(rowParent);
                        break;
                    case 0:
                        this.table[rowParent[ID]][LEFT] = rowLeft[RIGHT];
                        this.table[rowLeft[ID]][RIGHT] = rowParent[ID];
                        this.table[rowLeft[ID]][BALANCE] = -1;
                        finish[0] = 1;
                        break;
                }
                res = this.table[rowLeft[ID]];
                break;
            case 0:
                this.table[rowParent[ID]][BALANCE] = 1;
                res = this.table[rowParent[ID]];
                finish[0] = 1;
                break;
        }

        return res;
    }

    delete(value) {
        let rowToDelete;
        let rowParent;
        let rowSucesor;
        let rowPivot;
        let rowParentSucesor;
        let action;
        let stack = new Stack();
        let found = false;
        var finish = [];
        let rowBalanced = this.table[0];
        let key = value;
        let queue = new Queue();

        if (this.table[0][LEFT] == 0) {
            return (1);
        }

        finish[0] = 0;
        rowToDelete = this.table[this.table[0][LEFT]];

        while (!found && rowToDelete[ID] != 0) {//buscar nodo a eliminar
            stack.push(rowToDelete);
            if (value < rowToDelete[VALUE])
                rowToDelete = this.table[rowToDelete[LEFT]];
            else if (value > rowToDelete[VALUE])
                rowToDelete = this.table[rowToDelete[RIGHT]];
            else found = true;
        }

        if (!found) {
            return (2);
        }

        stack.pop();

        if (rowToDelete[LEFT] == 0 && rowToDelete[RIGHT] == 0) {//hoja
            action = 0;
        } else if (rowToDelete[RIGHT] == 0) {//hijos a la izq
            action = 1;
        } else if (rowToDelete[LEFT] == 0) {//hijos a la derecha
            action = 2;
        } else {//dos hijos
            action = 3;
        }

        if (action == 0 || action == 1 || action == 2) {//hojas o máx un hijo
            if (!stack.isEmpty()) {//el nodo a borrar no es la raiz
                rowParent = stack.pop();
                if (key < rowParent[VALUE]) {//el nodo a borrar es hijo izquierdo
                    switch (action) {
                        case 0:// es hoja
                        case 1://hijos a la izquierda
                            this.table[rowParent[ID]][LEFT] = rowToDelete[LEFT];
                            rowBalanced = this.balanceRight(this.table[rowParent[ID]], finish);
                            break;
                        case 2://hijos a la derecha
                            this.table[rowParent[ID]][LEFT] = rowToDelete[RIGHT];
                            rowBalanced = this.balanceRight(this.table[rowParent[ID]], finish);
                            break;
                    }
                } else {//el nodo a borrar es hijo derecho
                    switch (action) {
                        case 0:// es hoja
                        case 2://hijos a la derecha
                            this.table[rowParent[ID]][RIGHT] = rowToDelete[RIGHT];
                            rowBalanced = this.balanceLeft(this.table[rowParent[ID]], finish);
                            break;
                        case 1://hijos a la izquierda
                            this.table[rowParent[ID]][RIGHT] = rowToDelete[LEFT];
                            rowBalanced = this.balanceLeft(this.table[rowParent[ID]], finish);
                            break;
                    }
                }

            } else {//el nodo a borrar es la raiz
                switch (action) {
                    case 0:
                        this.table[0][LEFT] = 0;
                        finish[0] = 1;
                        break;
                    case 1:
                        this.table[0][LEFT] = rowToDelete[LEFT];
                        break;
                    case 2:
                        this.table[0][LEFT] = rowToDelete[RIGHT];
                        break;
                }
            }

        } else {//tiene hijos en ambos lados
            if (!stack.isEmpty()) {
                rowParent = stack.pop();
                stack.push(rowParent);
            } else {
                rowParent = this.table[0];
            }

            rowSucesor = this.table[rowToDelete[RIGHT]];
            rowParentSucesor = this.table[0];

            while (rowSucesor[LEFT] != 0) {//encontrar al sucesor
                queue.enqueue(rowSucesor);
                rowParentSucesor = rowSucesor;
                rowSucesor = this.table[rowSucesor[LEFT]]
            }
            key = rowSucesor[VALUE];
            if (rowParentSucesor[ID] != 0) {//el sucesor esta 1 o más niveles debajo del hijo derecho del nodo eliminado
                this.table[rowParentSucesor[ID]][LEFT] = rowSucesor[RIGHT];
                this.table[rowSucesor[ID]][LEFT] = rowToDelete[LEFT];//copiar izquierda al sucesor
                this.table[rowSucesor[ID]][RIGHT] = rowToDelete[RIGHT];//copiar derecha al sucesor
                this.table[rowSucesor[ID]][BALANCE] = rowToDelete[BALANCE];
                rowBalanced = this.balanceRight(this.table[rowParentSucesor[ID]], finish);

                if (!stack.isEmpty()) {
                    if (key < rowParent[VALUE]) {
                        this.table[rowParent[ID]][LEFT] = rowSucesor[ID];
                    } else {
                        this.table[rowParent[ID]][RIGHT] = rowSucesor[ID];
                    }
                } else {
                    this.table[rowParent[ID]][LEFT] = rowSucesor[ID];
                }

            } else {//el sucesor es el hijo derecho del nodo eliminado
                this.table[rowSucesor[ID]][LEFT] = rowToDelete[LEFT];//copiar izquierda al sucesor
                this.table[rowSucesor[ID]][BALANCE] = rowToDelete[BALANCE];
                rowBalanced = this.balanceLeft(this.table[rowSucesor[ID]], finish);
            }

            stack.push(this.table[rowSucesor[ID]]);

            while (!queue.isEmpty()) {
                stack.push(queue.dequeue());
            }
            stack.pop();
        }

        while (!stack.isEmpty() && finish[0] == 0) {

            rowPivot = stack.pop();

            if (key < rowPivot[VALUE]) {
                if (rowBalanced[ID] != 0) {
                    this.table[rowPivot[ID]][LEFT] = rowBalanced[ID];
                }
                rowBalanced = this.balanceRight(rowPivot, finish);
            } else {
                if (rowBalanced[ID] != 0) {
                    this.table[rowPivot[ID]][RIGHT] = rowBalanced[ID];
                }
                rowBalanced = this.balanceLeft(rowPivot, finish);
            }
        }

        if (rowBalanced[ID] != 0) {
            if (stack.isEmpty()) {
                this.table[0][LEFT] = rowBalanced[ID];
            } else {
                rowPivot = stack.pop();
                if (key < rowPivot[VALUE]) {
                    this.table[rowPivot[ID]][LEFT] = rowBalanced[ID];
                } else {
                    this.table[rowPivot[ID]][RIGHT] = rowBalanced[ID];
                }
            }
        }

        this.table[rowToDelete[ID]][LEFT] = 0;
        this.table[rowToDelete[ID]][RIGHT] = this.table[0][RIGHT];
        this.table[rowToDelete[ID]][VALUE] = '';
        this.table[rowToDelete[ID]][BALANCE] = 0;
        this.table[0][RIGHT] = rowToDelete[ID];

    }

    toHTML(head) {
        let html = "";
        let htmlLeft;
        let htmlRight;

        let color;

        if (head[ID] == 0) {
            return '<li><span class="px-2 py-1">*</span></li>';
        } else {
            htmlLeft = this.toHTML(this.table[head[LEFT]]);
            htmlRight = this.toHTML(this.table[head[RIGHT]]);

            if (head[BALANCE] == -1) {
                color = "badge-primary";
            } else if (head[BALANCE] == 0) {
                color = "badge-dark";
            } else {
                color = "badge-danger";
            }

            html = '<li>' +
                '<div class="badge px-2 py-1 ' + color + '" onclick="deleteNode(\'' + head[VALUE] + '\')">' +
                '<small>' + head[ID] + '</small><br>' + head[VALUE] + '</div>';

            if (!(head[LEFT] === 0 && head[RIGHT] === 0)) {

                html += '<ul>' +
                    htmlLeft +
                    htmlRight +
                    '</ul>' +
                    '</li>';
            }

            html += '</li>';
        }

        return html;
    }

    toMatrixHTML(tree) {
        let html = '';
        for (let i = 0; i < this.table.length; i++) {
            html += '<tr>';
            for (let j = 0; j < 5; j++) {
                html += '<td scope="row">' + this.table[i][j] + '</td>';
            }
            html += '</tr>';
        }

        return html;
    }
}

var matrixAVL = new MatrixAVL();

function printMatrix() {
    $("#contentTable").html(matrixAVL.toMatrixHTML(matrixAVL.table));
}

function printTree() {
    $('#treeUl').html(matrixAVL.toHTML(matrixAVL.table[matrixAVL.table[0][LEFT]]));
}

function insertNode() {
    if ($('#nameTxt').val() !== "") {
        matrixAVL.insert($('#nameTxt').val());
        printTree();
        printMatrix();
        $("#nameTxt").val("");
    } else {
        alert("Ingrese un dato valido");
    }
    $("#nameTxt").focus();
}

function deleteNode(value) {
    var r = confirm("Desea eliminar el nodo " + value + "?");
    if (r === true) {
        matrixAVL.delete(value);
        printTree();
        printMatrix();
    }
}

printTree();
printMatrix();
