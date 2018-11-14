import FunctionLine from '../model/FunctionLine';
import ElementsTable from '../model/ElementsTable';
import AssignmentLine from '../model/AssignmentLine';
import ReturnLine from '../model/ReturnLine';
import VariableLine from '../model/VariableLine';
import WhileLine from '../model/WhileLine';
import IfLine from '../model/IfLine';
import ElseIfLine from '../model/ElseIfLine';
import ElseLine from '../model/ElseLine';

let ElementsTableModel;

const returnStatementTabler = (returnStatement) => {
    const returnLine = new ReturnLine(returnStatement);
    ElementsTableModel.addRow(returnLine);
};

const expressionStatementTabler = (expressionStatement) => {
    const { expression } = expressionStatement;
    const assignmentLine = new AssignmentLine(expression);
    ElementsTableModel.addRow(assignmentLine);
};

const whileStatementTabler = (whileStatement) => {
    const whileLine = new WhileLine(whileStatement);
    ElementsTableModel.addRow(whileLine);
    expressionBodyTabler(whileStatement.body);
};

const alternateTabler = (alternate) => {
    if(!alternate) return;
    const { type } = alternate;
    if(type === 'IfStatement'){
        return ifStatementTabler(alternate, true);
    }
    const elseLine = new ElseLine(alternate);
    ElementsTableModel.addRow(elseLine);
    expressionBodyTabler(alternate);
};

const ifStatementTabler = (ifStatement, isElse = false) => {
    const ifLine = isElse ? new ElseIfLine(ifStatement) : new IfLine(ifStatement);
    ElementsTableModel.addRow(ifLine);
    const { alternate, consequent} = ifStatement;
    expressionBodyTabler(consequent);
    alternateTabler(alternate);
};

const variableDeclaratorTabler = (declarationsContainer) => {
    const { declarations } = declarationsContainer;
    for(let i = 0; i < declarations.length; i++){
        const variableLine = new VariableLine(declarations[i].id);
        ElementsTableModel.addRow(variableLine);
    }
};

const functionParamTabler = (param) => {
    ElementsTableModel.addRow(new VariableLine(param));
};

const functionTabler = (functionObject) => {
    const functionLine = new FunctionLine(functionObject);
    ElementsTableModel.addRow(functionLine);
    const { params, body } = functionObject;
    params.forEach(param => functionParamTabler(param));
    expressionBodyTabler(body);
};

const expressionBodyTabler = (objectStatements) => {
    const { type, body } = objectStatements;
    if(type !== 'BlockStatement'){
        return lineTabler(objectStatements);
    }
    for(let i = 0; i < body.length; i++){
        lineTabler(body[i]);
    }
};


// eslint-disable-next-line complexity
const lineTabler = (object) =>
{
    const { type } = object;
    switch(type){
    case 'FunctionDeclaration':
        functionTabler( object); break;
    case 'VariableDeclaration':
        variableDeclaratorTabler(object); break;
    case 'ExpressionStatement':
        expressionStatementTabler(object); break;
    case 'WhileStatement':
        whileStatementTabler(object); break;
    case 'IfStatement':
        ifStatementTabler(object); break;
    case 'ReturnStatement':
        returnStatementTabler(object); break;
    default:
    }
};

const bodyTabler = (parsedCodeBody) => {
    for(let i = 0 ; i < parsedCodeBody.length ; i++){
        lineTabler(parsedCodeBody[i]);
    }
};

export const createElementTable = (parsedCode) => {
    const { body } = parsedCode;
    ElementsTableModel = new ElementsTable();
    bodyTabler(body);
    return ElementsTableModel;
};

export const implementElementTableUI = (ui) => {
    ui.clean();
    ui.createTable(ElementsTableModel);
};