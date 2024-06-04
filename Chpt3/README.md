# QUALITY METRIC EVALUATION OF AUTO-ANNOTATION APPROACHES FOR POLAR SCIENCE
### FA23_ComputerVision


These notebooks contain the models which evaluate the utility of the layers and quality metrics as methods for identifying quailty layer tracings.

We provided two different representations from our datasets to the models. The first representation, *LayerData*, took a binary representation of the annotated layers as an input to the model and the mean and standard deviation for each metric. This representation has 743 labeled instances. The second representation, *MetricData*, took the entirety of the quality metrics and omitted the annotated layers. This representation only has 635 labeled representations due to more stringent size requirements. Neither representation contained the raw radar data so as not to bloat the feature space.


## Notebooks

Load_Data - Shows how to load the data for both *LayerData* and *MetricData*. You will need to adjust the file paths to the data locations.


### Uses *LayerData*
RandomForest_LayerData <br>
SVM_XGBoost_models_LayerData <br>
NeuralNet_LayerData <br>

### Uses *MetricData*
RandomForest_MetricData <br>
SVM_XGBoost_models_MetricData <br>
NeuralNet_MetricData <br>
Confusion_Matrix

