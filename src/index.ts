import ClientAdapter from './ClientAdapter';


//todo 1. fix add to queue!! 2. think about global discordMessage!!!

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



