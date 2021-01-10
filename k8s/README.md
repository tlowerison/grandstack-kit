### k8s
Setting up Kubernetes clusters is hard to get right! This doc is intended to point you in the right direction of all the basic resources we'll want to leverage in our cluster.

##### Neo4j
First, you'll need to install a Neo4j instance on your cluster using the [neo4j-helm chart](https://github.com/neo4j-contrib/neo4j-helm). Specifically, run this command to set up a standalone server (replace the .tgz link with whichever release you choose from their [releases page](https://github.com/neo4j-contrib/neo4j-helm/releases))
```
helm install mygraph https://github.com/neo4j-contrib/neo4j-helm/releases/download/4.2.0-1/neo4j-4.2.0-1.tgz --set core.standalone=true --set acceptLicenseAgreement=yes --set neo4jPassword=mySecretPassword
```

##### Ingress Controller
You'll need to install an Ingress Controller to use the Ingress resource. This boilerplate is set up to use `ingress-nginx` so we'll install it's respective controller
```
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v0.34.1/deploy/static/provider/do/deploy.yaml
```
More info on [Kubernetes Ingresses](https://kubernetes.io/docs/concepts/services-networking/ingress/)

##### Image Repository
We need to create secret containing our image repository's credentials, here are some good resources for doing so:
- https://stackoverflow.com/questions/49032812/how-to-pull-image-from-dockerhub-in-kubernetes
- https://www.digitalocean.com/community/tutorials/how-to-set-up-a-private-docker-registry-on-top-of-digitalocean-spaces-and-use-it-with-digitalocean-kubernetes
Regardless of who provides your repository, make sure the secret created registry credentials is called `regcred` (or go change the value of `imagePullSecrets.name` in all of the `k8s` deployment files to whatever the registry credentials secret you create is named).

##### Secrets
Finally, you'll need to create a couple of secrets which will be used as the environment variables in our pods.
The first and easiset is our local secrets, called `grandstack-kit-prod-secrets`.
```
kubectl create secret generic grandstack-kit-prod-secrets \
--from-literal=api-key-secret='a-lot-of-random-letters-and-numbers-here'
--from-literal=jwt-secret='32-random-numbers-letter-and-symbols-here'
--from-literal=neo4j-username=neo4j
--from-literal=session-secret='a-lot-of-random-letters-and-numbers-here'
```
More info on [Kubernetes Secrets](https://kubernetes.io/docs/concepts/configuration/secret/)

##### TLS Certificate
Here are two good walkthroughs on how to get `certificate-manager` started up on your cluster to enable you to set up a TLS certificate for your domain.
- https://medium.com/flant-com/cert-manager-lets-encrypt-ssl-certs-for-kubernetes-7642e463bbce
- https://www.digitalocean.com/community/tutorials/how-to-set-up-an-nginx-ingress-with-cert-manager-on-digitalocean-kubernetes
