#!/usr/bin/env node
###
#   Remote MakeMKV Controller
#
#   Provides the server aspect of Remote MakeMKV
#
#   @author     David Lasley, dave@dlasley.net
#   @website    https://dlasley.net/blog/projects/remote-makemkv/
#   @package    remote-makemkv
#   @license    GPLv3
#   @version    $Id: link_checker.py,v 12d42dd25501 2013/10/11 20:29:34 dlasley $
###
__version__ = "$Revision: 12d42dd25501 $"

http = require('http')
io = require('socket.io')
url = require('url')
fs = require('fs')
CoffeeScript = require('coffee-script')
MakeMKV = require('./makemkv.coffee')


class MakeMKVServer

    CLIENT_FILE: __dirname + '/client.html'
    SUCCESS_STRING: 'success'
    CLIENT_COFFEE: __dirname + '/client.coffee'

    constructor: (port) ->
        
        @MakeMKV = new MakeMKV(false)
        @cache = {}
        @change_out_dir() #< Prime the out dir cache
        
        server = http.createServer((req, res) =>
            
            req.setEncoding 'utf8'
            path = url.parse(req.url).pathname
            
            if req.method == 'POST'
            
                req.on('data', (chunk) =>
                    data = JSON.parse(chunk.toString())
                    @do_broadcast(socket, {'app':path[1..], 'data':data})
                    res.end(@SUCCESS_STRING)
                )
            
            else
            
                switch path
                    
                    when '/' #< Serve static client html
                        res.writeHead(200, {'Content-Type': 'text/html'})
                        res.end(fs.readFileSync(@CLIENT_FILE,
                                                {encoding:'utf-8'}))
                        
                    when '/client' #< Serve the client coffeescript
                        res.writeHead(200, {'Content-Type': 'application/javascript'})
                        cs = fs.readFileSync(@CLIENT_COFFEE, {encoding:'utf-8'})
                        res.end(CoffeeScript.compile(cs)) #< @todo globalize the load, this is good for testing
                    
                    when '/favicon.ico' #< Favicon
                        res.writeHead(200, {'Content-Type': 'image/x-icon'} )
                        #   @todo..make an icon
                        res.end('Success')
                        
        ).listen(@MakeMKV.LISTEN_PORT)
        
        socket = io.listen(server)
        console.log('Listening on ' + @MakeMKV.LISTEN_PORT)
        
        #   Bind socket actions on client connect
        socket.on('connection', (client) =>
            
            single_broadcast = (data) => @do_emit(socket, data)
            
            client.on('display_cache', (data) =>
                #   Send cache to client
                @display_cache((msgs)=>
                    for msg in msgs 
                        single_broadcast(msg)
                )
            )
            
            #   User has sent command to change save_dir
            client.on('change_out_dir', (data) =>
                console.log('changing out dir')
                @save_out_dir(data, single_broadcast)
            )
            
            #   User has sent command to scan drives
            client.on('scan_drives', (data) =>
                console.log('scanning drives')
                @MakeMKV.scan_drives(single_broadcast)
            )
            
            #   User has sent command to retrieve single disc info
            client.on('disc_info', (data) =>
                console.log('getting disc info for', data)
                @MakeMKV.disc_info(data, single_broadcast)
            )
            
            #   User has sent command to retrieve single disc info
            client.on('rip_track', (data) =>
                console.log('getting disc info for', data)
                @MakeMKV.rip_track(data['save_dir'], data['drive_id'],
                                   data['track_ids'], single_broadcast)
            )
            
            ##  Socket debugging
            client.on('message', (data) ->
                console.log('Client sent:', data)
            )
            client.on('disconnect', () ->
                console.log('Client d/c')
            )
            
        )

    ##  Send cached data to client in logic order
    #       scan_drives, disc_info, rip_track
    display_cache: (callback=false) =>
        
        cmd_order = ['change_out_dir', 'scan_drives', 'disc_info', 'rip_track']
        cached = []
        for cmd in cmd_order
            if typeof(@cache[cmd]) == 'object'
                for namespace of @cache[cmd]
                    cached.push({'cmd':cmd, 'data':@cache[cmd][namespace]})

        if callback
            callback(cached)
        else
            cached

    ##  Signal emit
    #   @param  socket  socket  socket
    #   @param  dict    msg     Msg, {'cmd':(str)signal_to_emit,'data':(dict)}
    do_emit: (socket, msg) ->
        
        cmd = msg['cmd']
        data = msg['data']
        
        if data['data'] #< If there's a second data dimension (cached)
            data = data['data'] #< Pull and save it instead
            
        namespace = if data['disc_id'] then data['disc_id'] else 'none'
        data = @_cache_data(cmd, data, namespace)
        socket.sockets.emit(cmd, data)

    ##  Cache data to variable for when clients join
    #   @param  str     cmd     Command that will be emitted
    #   @param  mixed   data    Data obj
    #   @param  str     namespace   Namespace to cache data in (multiple single drive cmds)
    #   @return dict    data with cache_refreshed date {'data':mixed, 'cache_refreshed':Date}
    _cache_data: (cmd, data, namespace='none') =>
        
        if typeof(@cache[cmd]) != 'object'
            @cache[cmd] = {}

        @cache[cmd][namespace] = {'cache_refreshed': new Date(), 'data': data }
        
        @cache[cmd][namespace]
    
    ##  Register change to save directory (UI)
    change_out_dir: () =>
        
        @_cache_data('change_out_dir', @MakeMKV.save_to)

    ##  Save change to save directory
    #   @param  str dir New save dir
    save_out_dir: (dir, callback=false) =>
        
        @MakeMKV.save_to = dir
        @change_out_dir()
        
        if callback
            callback(@MakeMKV.save_to)
        else
            @MakeMKV.save_to
        
        
server = new MakeMKVServer()