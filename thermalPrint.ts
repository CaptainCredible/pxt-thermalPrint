/**
* Makecode block for thermal printer
*/

namespace thermalPrint {


    let heatTime: number
    heatTime = 80          //80 is default. Controls speed of printing and darkness
    let heatInterval: number
    heatInterval = 2      //2 is default. Controls speed of printing and darkness
    let printDensity: number
    printDensity = 15       //Not sure what the defaut is. Testing shows the max helps darken text. From page 23.
    let printBreakTime: number
    printBreakTime = 15     //Not sure what the defaut is. Testing shows the max helps darken text. From page 23.

    export enum bgColor {

        //%block="White"
        White = 0,
        //%block="Black"
        Black = 1
    }

    export enum textBold {

        //%block="Off"
        Off = 0,
        //%block="On"
        On = 1
    }


    export enum textAlignment {

        //%block="Left"
        Left = 48,
        //%block="Centre"
        Centre = 49,
        //%block="Right"
        Right = 50
    }

    export enum textunderline {

        //%block="Off"
        Off = 48,
        //%block="Light"
        Light = 49,
        //%block="Dark"
        Dark = 50
    }

    /**
     * Initialize Thermal Printer
     * @param Configure pin for serial communication
     */
    //% subcategory=Thermal-Printer
    //% blockId="ThermalPrinter_setSerial" block="Connect printer RX to %pinRX|TX to %pinTX"
    //% weight=100 blockExternalInputs=true blockGap=3
    export function thermal_printer_setSerial(pinRX: SerialPin, pinTX: SerialPin, baudrate: BaudRate): void {

        serial.redirect(
            pinRX,
            pinTX,
            BaudRate.BaudRate9600
        )
        basic.pause(500)

        let dataBuffer0 = pins.createBuffer(2)
        dataBuffer0.setNumber(NumberFormat.UInt8LE, 0, 27)
        dataBuffer0.setNumber(NumberFormat.UInt8LE, 1, 64)  //reset to default
        serial.writeBuffer(dataBuffer0)

        basic.pause(100)

        let dataBuffer = pins.createBuffer(8)
        dataBuffer.setNumber(NumberFormat.UInt8LE, 0, 27)       //0x1B
        dataBuffer.setNumber(NumberFormat.UInt8LE, 1, 55)       //0x37
        dataBuffer.setNumber(NumberFormat.UInt8LE, 2, 7)        //default 64 dots
        dataBuffer.setNumber(NumberFormat.UInt8LE, 3, heatTime) //default 80
        dataBuffer.setNumber(NumberFormat.UInt8LE, 4, heatInterval) //default 2 or 20us
        dataBuffer.setNumber(NumberFormat.UInt8LE, 5, 18)
        dataBuffer.setNumber(NumberFormat.UInt8LE, 6, 35)
        let printSetting = (printDensity << 4) | printBreakTime
        dataBuffer.setNumber(NumberFormat.UInt8LE, 7, printSetting)

        serial.writeBuffer(dataBuffer)
        basic.pause(500)
    }

    /**
     * Print string and line feed
     * @param s is string to be printed, eg: "Hello"
     */
    //% subcategory=Thermal-Printer
    //% blockId="ThermalPrinter_printString" block="Print string %s"
    //% weight=98 blockGap=3
    export function printString(s: string): void {
        let dataBuffer = pins.createBuffer(1)

        serial.writeString(s)

        dataBuffer.setNumber(NumberFormat.UInt8LE, 0, 10) //line feed
        serial.writeBuffer(dataBuffer)
    }

    /**
     * Print number and line feed
     * @param num is number to be printed, eg: 123
     */
    //% subcategory=Thermal-Printer
    //% blockId="ThermalPrinter_printNum" block="Print number %num"
    //% weight=97 blockGap=3
    export function printNum(num: number): void {
        let dataBuffer = pins.createBuffer(1)

        serial.writeNumber(num)

        dataBuffer.setNumber(NumberFormat.UInt8LE, 0, 10) //line feed
        serial.writeBuffer(dataBuffer)
    }


    /**
     * Store text in printer memory. Require "New line" command to print
     * @param s is string to be stored, eg: "Hello World"
     * @param text will be stored in printer buffer. - you need to send a newLine command to empty buffer and print
     */
    //% subcategory=Thermal-Printer
    //% blockId="ThermalPrinter_printStringBuffer" block="Store string in memory %s"
    //% weight=96 blockGap=3
    export function printStringBuffer(s: string): void {
        serial.writeString(s)
    }

    /**
     * Store number in printer memory. Require "New line" command to print
     * @param num is number to be stored, eg: 123
     * @param number will be stored in printer buffer. - you need to send a newLine command to empty buffer and print
     */
    //% subcategory=Thermal-Printer
    //% blockId="ThermalPrinter_printNumBuffer" block="Store number in memory %s"
    //% weight=95 blockGap=3
    export function printNumBuffer(num: number): void {
        serial.writeNumber(num)
    }

    /**
     * New Line
     * @param Sending line feed to the printer
     */
    //% subcategory=Thermal-Printer
    //% blockId="ThermalPrinter_newLine" block="New line"
    //% weight=90 blockGap=20
    export function LineFeed(): void {
        let dataBuffer = pins.createBuffer(1)
        dataBuffer.setNumber(NumberFormat.UInt8LE, 0, 10) //send LF
        serial.writeBuffer(dataBuffer)
    }

    /**
     * Reset printer
     */
    //% subcategory=Thermal-Printer
    //% blockId="ThermalPrinter_resetPrint" block="Reset printer"
    //% weight=20 blockGap=3
    export function resetPrinter(): void {
        let dataBuffer = pins.createBuffer(2)
        dataBuffer.setNumber(NumberFormat.UInt8LE, 0, 27)
        dataBuffer.setNumber(NumberFormat.UInt8LE, 1, 64)
        serial.writeBuffer(dataBuffer)
    }



    /**
     * Set printing density (1  to 15) and break time (1 to 15)
     * @param Density is to set printing density, eg: 10
     * @param BreakTime is to set print break time, eg: 10
     */
    //% subcategory=Thermal-Printer
    //% blockId="ThermalPrinter_setDensityBreakTime" block="Set print density %Density| break-time %BreakTime"
    //% weight=58  blockExternalInputs=true blockGap=20
    //% Density.min=1 Density.max=15
    //% BreakTime.min=1 BreakTime.max=15
    export function setDensityBreakTime(Density: number, BreakTime: number): void {
        let pDensity: number
        pDensity = Density
        let pBT: number
        pBT = BreakTime
        let printSetting: number
        printSetting = pDensity << 4
        printSetting = printSetting | pBT

        let dataBuffer = pins.createBuffer(3)
        dataBuffer.setNumber(NumberFormat.UInt8LE, 0, 18) //DC2
        dataBuffer.setNumber(NumberFormat.UInt8LE, 1, 10) //#
        dataBuffer.setNumber(NumberFormat.UInt8LE, 2, printSetting)

        serial.writeBuffer(dataBuffer)
    }

    /**
    * Set heating duration (4  to 255, default 80) and interval (2 to 255, default 2)
    * @param heatTime is to set heating duration, eg: 80
    * @param heatInterval is to set heating interval, eg: 2
    */
    //% subcategory=Thermal-Printer
    //% blockId="ThermalPrinter_setHeating" block="Set heating duration %heatTime| interval %heatInterval"
    //% weight=59  blockExternalInputs=true blockGap=3
    //% heatTime.min=4 heatTime.max=255
    //% heatInterval.min=2 heatInterval.max=255
    export function setHeating(heatTime: number, heatInterval: number): void {

        let pheatTime: number
        pheatTime = heatTime
        let pheatInterval: number
        pheatInterval = heatInterval

        let dataBuffer = pins.createBuffer(5)
        dataBuffer.setNumber(NumberFormat.UInt8LE, 0, 27)       //0x1B
        dataBuffer.setNumber(NumberFormat.UInt8LE, 1, 55)       //0x37
        dataBuffer.setNumber(NumberFormat.UInt8LE, 2, 7)        //default 64 dots
        dataBuffer.setNumber(NumberFormat.UInt8LE, 3, pheatTime) //default 80
        dataBuffer.setNumber(NumberFormat.UInt8LE, 4, pheatInterval)

        serial.writeBuffer(dataBuffer)
    }

    /**
     * Set the line spacing (default is 30)
     * @param lineSpace is to set the line spacing, eg: 30
     */
    //% subcategory=Thermal-Printer 
    //% blockId="ThermalPrinter_lineSpace" block="Set line spacing  %lineSpace"
    //% weight=83 blockGap=3
    //% lineSpace.min=0 lineSpace.max=255
    export function setLineSpacing(lineSpace: number) {
        let pLineSpace: number
        pLineSpace = lineSpace

        let dataBuffer = pins.createBuffer(3)
        dataBuffer.setNumber(NumberFormat.UInt8LE, 0, 27)
        dataBuffer.setNumber(NumberFormat.UInt8LE, 1, 51)
        dataBuffer.setNumber(NumberFormat.UInt8LE, 2, pLineSpace)

        serial.writeBuffer(dataBuffer)

    }

    /**
      * Align text to left, centre or right
      */
    //% subcategory=Thermal-Printer 
    //% blockId="ThermalPrinter_textAlign" block="Text align to %textAlign"
    //% weight=84 blockGap=3
    export function setTextAlign(textAlign: textAlignment) {
        let ptextAlign: number
        ptextAlign = textAlign

        let dataBuffer = pins.createBuffer(3)
        dataBuffer.setNumber(NumberFormat.UInt8LE, 0, 27)
        dataBuffer.setNumber(NumberFormat.UInt8LE, 1, 97)
        dataBuffer.setNumber(NumberFormat.UInt8LE, 2, ptextAlign)

        serial.writeBuffer(dataBuffer)

    }

    /**
     * Print underline.
     */
    //% subcategory=Thermal-Printer 
    //% blockId="ThermalPrinter_underLine" block="Underline %underlineText"
    //% weight=87 blockGap=3
    export function setUnderLine(underlineText: textunderline) {
        let punderlineText: number
        punderlineText = underlineText

        let dataBuffer = pins.createBuffer(3)
        dataBuffer.setNumber(NumberFormat.UInt8LE, 0, 27)
        dataBuffer.setNumber(NumberFormat.UInt8LE, 1, 45)
        dataBuffer.setNumber(NumberFormat.UInt8LE, 2, punderlineText)

        serial.writeBuffer(dataBuffer)

    }

    /**
     * Set text background color to white/black
     */
    //% subcategory=Thermal-Printer 
    //% blockId="ThermalPrinter_backGroundColor" block="Set text background to  %backgroundColor"
    //% weight=82 blockGap=20
    export function backGroundColor(backgroundColor: bgColor) {
        let pBackgroundColor: number
        pBackgroundColor = backgroundColor

        let dataBuffer = pins.createBuffer(3)
        dataBuffer.setNumber(NumberFormat.UInt8LE, 0, 29)
        dataBuffer.setNumber(NumberFormat.UInt8LE, 1, 66)

        if (pBackgroundColor === bgColor.White) {
            dataBuffer.setNumber(NumberFormat.UInt8LE, 2, 0)
        } else {
            dataBuffer.setNumber(NumberFormat.UInt8LE, 2, 1)
        }
        serial.writeBuffer(dataBuffer)

    }

    /**
     * Set bold On/Off
     */
    //% subcategory=Thermal-Printer 
    //% blockId="ThermalPrinter_setTextBold" block="Bold %boldText"
    //% weight=89 blockGap=3
    export function setTextBold(boldText: textBold) {
        let pboldText: number
        pboldText = boldText

        let dataBuffer = pins.createBuffer(3)
        dataBuffer.setNumber(NumberFormat.UInt8LE, 0, 27)
        dataBuffer.setNumber(NumberFormat.UInt8LE, 1, 69)

        if (pboldText === textBold.Off) {
            dataBuffer.setNumber(NumberFormat.UInt8LE, 2, 0)
        } else {
            dataBuffer.setNumber(NumberFormat.UInt8LE, 2, 1)
        }
        serial.writeBuffer(dataBuffer)

    }

    /**
     * Set Character size. Default value: 0,0
     * @param Width is to set character width, eg: 0
     * @param Height is to set character height, eg: 0
     */
    //% subcategory=Thermal-Printer 
    //% blockId="ThermalPrinter_setCharacterSize" block="Set character size width %Width| height %Height"
    //% weight=85 blockExternalInputs=true blockGap=3
    //% Width.min=0 Width.max=4
    //% Height.min=0 Height.max=4
    export function setCharacterSize(Width: number, Height: number): void {
        let pWidth: number
        pWidth = Width
        let pHeight: number
        pHeight = Height
        let pSize: number
        pSize = pWidth << 4
        pSize = pSize | pHeight

        let dataBuffer = pins.createBuffer(3)
        dataBuffer.setNumber(NumberFormat.UInt8LE, 0, 29)
        dataBuffer.setNumber(NumberFormat.UInt8LE, 1, 33)
        dataBuffer.setNumber(NumberFormat.UInt8LE, 2, pSize)

        serial.writeBuffer(dataBuffer)
    }


    /**
    * Print facotry test page
    * @param Sending line feed to the printer
    */
    //% subcategory=Thermal-Printer
    //% blockId="ThermalPrinter_printTestPage" block="Print factory test page"
    //% weight=10 blockGap=8
    export function printTestPage(): void {
        let dataBuffer = pins.createBuffer(2)
        dataBuffer.setNumber(NumberFormat.UInt8LE, 0, 18) //DC2
        dataBuffer.setNumber(NumberFormat.UInt8LE, 1, 84) //T
        serial.writeBuffer(dataBuffer)
    }
}