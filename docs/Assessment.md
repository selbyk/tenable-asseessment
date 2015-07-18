# Programming Assessment
No external libraries or frameworks may be used, including Express.  Organize code as any node.js project and submit a zip/tar of entire directory structure.

##### 1) Create a RESTful API with routes allowing a user to:
- Login
- Logout

##### 2) Extend RESTful API with routes allowing an authenticated user to:
- Retrive JSON sever configs (example below)
- Create configurations
- Delete configurations
- Modify configurations

```json
{
  "configurations" : [
    {
      "name" : "host1",
      "hostname" : "nessus-ntp.lab.com",
      "port" : 1241,
      "username" : "toto"
    },
    {
      "name" : "host2",
      "hostname" : "nessus-xml.lab.com",
      "port" : 3384,
      "username" : "admin"
    }
  ]
}
```

##### 3) Modify RESTful API routes to support:
- Sorting
  - name
  - hostname
  - port
  - username
- Pagination (randomize and expand configs for this)
