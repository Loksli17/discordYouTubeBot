import ClientAdapter from './ClientAdapter';


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



