import puppeteer from "puppeteer";

export async function ObterCursosTareas(User, pass) {
    const browser = await puppeteer.launch({
        headless: true,
    });
    const page = await browser.newPage();
    await page.goto("https://campusvirtual.intec.edu.do/login/index.php");
    // https://lms-23t4.intec.edu.do/login/index.php
    await page.type('#username', User);

    await page.type('#password', pass);

    await page.click('#loginbtn');

    await page.waitForNavigation({ waitUntil: 'networkidle0' });

    const ArrHref = [];

    const elementosListGroup = await page.$$('a.aalink.coursename');

    for (const elemento of elementosListGroup) {
        let obj = {};
        const contenido = await page.evaluate(el => el.href, elemento);
        const nombre = await page.evaluate(el => el.innerText, elemento);
        obj[obtenerParteDespuesDeSaltoDeLinea(nombre)] = contenido;
        ArrHref.push(obj);
    }
    const ArrClases = [];

    for (const elemento of ArrHref) {

        let obj = {};
        let id = obtenerIdDesdeURL(Object.values(elemento)[0]);
        await page.goto(`https://campusvirtual.intec.edu.do/grade/report/index.php?id=${id}`);
        const arr = [];
        const elementosgradeitemheader = await page.$$('a.gradeitemheader ');
        for (const elementoA of elementosgradeitemheader) {
            const contenido = await page.evaluate(el => el.href, elementoA);
            arr.push(contenido);
        }
        obj[Object.keys(elemento)[0]] = arr;
        ArrClases.push(obj)
    }


    let ArregloClaseTarea = [];
    for (const elementoClases of ArrClases) {

        const nombreClas = Object.keys(elementoClases)[0];
        let claseObj = {};
        let arr = [];


        for (const elemento of Object.values(elementoClases)[0]) {

            const obj =
            {
                dataFecha: {},
                dataNombreTarea: "",
                Estado: "",
                EstadoEnvio: "",
                Calificacion: "",
                Tarea: "",
                TiempoRestanteParaEnvio:"",

            };

            await page.goto(elemento, { waitUntil: 'domcontentloaded' });

            obj.dataFecha = await page.evaluate(() => {
                const container = document.querySelector('.activity-dates');
                if (container) {
                    const fechaDeInicio = container.querySelector('div:nth-child(1)');
                    const fechaDeCierre = container.querySelector('div:nth-child(2)');
                    return {
                        fechaDeInicio: fechaDeInicio ? fechaDeInicio.innerText : null,
                        fechaDeCierre: fechaDeCierre ? fechaDeCierre.innerText : null,
                    };
                } else {
                    return {
                        fechaDeInicio: null,
                        fechaDeCierre: null,
                    };
                }
            });

            obj.dataNombreTarea = await page.evaluate(() => {
                const taskNameElement = document.querySelector('.page-header-headings h1');
                return taskNameElement ? taskNameElement.innerText : null;
            });

            obj.TiempoRestanteParaEnvio = await page.evaluate(() => {
                const taskNameElement = document.querySelector('.timeremaining.cell.c1.lastcol');
                return taskNameElement ? taskNameElement.innerText : null;
            });
            obj.Estado = await page.evaluate(() => {
                const taskNameElement = document.querySelector('.submissiongraded');
                
                if (taskNameElement) {
                    return taskNameElement.innerText;
                } else {
                    const notGradedElement = document.querySelector('.submissionnotgraded');
                    return notGradedElement ? notGradedElement.innerText : null;
                }
            });


            obj.EstadoEnvio = await page.evaluate(() => {
                const taskNameElement = document.querySelector('.submissionstatussubmitted');
                
                if (taskNameElement) {
                    return taskNameElement.innerText;
                } else {
                    const notGradedElement = document.querySelector('.generaltable > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2)');
                    return notGradedElement ? notGradedElement.innerText : null;
                }
            });
            

            obj.Calificacion = await page.evaluate(() => {
                const taskNameElement = document.querySelector('.feedbacktable > div:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2)');
                return taskNameElement ? taskNameElement.innerText : null;
            });


            obj.Tarea = await page.evaluate(() => {
                const taskNameElement = document.querySelector('div#intro.activity-description');
                return taskNameElement ? taskNameElement.outerHTML : null;
            });
            obj.Tarea = normalizarTexto(obj.Tarea);


            arr.push(obj);

        }
        claseObj[nombreClas] = arr;
        ArregloClaseTarea.push(claseObj);
    }


    await browser.close();


    return ArregloClaseTarea;
}

export function obtenerIdDesdeURL(url) {
    var regex = /(?:\?|&)id=(\d+)/;
    var match = url.match(regex);

    if (match) {
        return match[1];
    } else {
        return null;
    }
}

export function obtenerParteDespuesDeSaltoDeLinea(inputString) {

    const partes = inputString.split('\n');
    const parteDeseada = partes[1];
    return parteDeseada;
}

export function normalizarTexto(texto) {
    // Verificar si el texto es null o undefined
    if (texto == null) {
        return null;
    }

    // Eliminar saltos de línea y espacios adicionales
    const textoNormalizado = texto.replace(/\n/g, '').replace(/\s+/g, ' ');
    return textoNormalizado;
}


