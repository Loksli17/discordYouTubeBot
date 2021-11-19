import ClientAdapter from './ClientAdapter';


//todo
//  1. when youtube search music problems can make with filter (Livsi play Valchala)
//! 2. catch youtude errors (Livsi play  Valchala Асений Карпов, Livsi play let's f*ck.. go), send message to user and don't add music in queue!!!!
//  3. add comments in all classes
//! 4. check prefix and don't command if message has not prefix


class App{

    private       client  : ClientAdapter;
    public static instance: App;

    private constructor(){
        this.client = new ClientAdapter();
    }

    public init(){
        this.client.start();
    }

    public static get Instance(): App{
        return this.instance || (this.instance = new this());
    }
}



let app: App = App.Instance;
app.init();



